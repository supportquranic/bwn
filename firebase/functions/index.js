const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/**
 * 1. Automatic Search Keyword Normalization Trigger
 * Generates lowercase keywords variations (e.g. "iphone 15", "iphone15", "15 pro")
 * for high-speed local indexing and spelling tolerance.
 */
exports.onProductCreateOrUpdate = functions.firestore
  .document('products/{productId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return null;
    const data = change.after.data();

    const name = (data.name || '').toLowerCase();
    const brand = (data.brand || '').toLowerCase();
    const model = (data.model || '').toLowerCase();
    const storage = (data.storage || '').toLowerCase();
    const color = (data.color || '').toLowerCase();

    // Generate tokens
    const textCorpus = `${name} ${brand} ${model} ${storage} ${color}`;
    const rawTokens = textCorpus.split(/[\s\-_,.]+/).filter(Boolean);

    // Variation generator (e.g. "iphone15" -> ["iphone", "15", "iphone15"])
    const variations = new Set(rawTokens);
    if (model.includes(' ')) {
      variations.add(model.replace(/\s+/g, ''));
    }

    const searchKeywords = Array.from(variations);

    // Only update if keywords changed to avoid recursive function loops
    const currentKeywords = data.searchKeywords || [];
    const hasChanged = JSON.stringify(searchKeywords.sort()) !== JSON.stringify(currentKeywords.sort());

    if (hasChanged) {
      return change.after.ref.update({
        searchKeywords,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    return null;
  });

/**
 * 2. Push Notification on Shop Status Verification
 * Alerts the shopkeeper via FCM when their shop is Approved or Rejected by Admin.
 */
exports.onShopStatusChange = functions.firestore
  .document('shops/{shopId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return null;

    const ownerId = after.ownerId;
    const userDoc = await db.collection('users').doc(ownerId).get();
    if (!userDoc.exists) return null;

    const fcmToken = userDoc.data().fcmToken;
    if (!fcmToken) return null;

    let title = 'Shop Status Update';
    let body = `Your shop "${after.name}" status has been updated to ${after.status}.`;

    if (after.status === 'approved') {
      title = '🎉 Shop Approved - Bahawal Market';
      body = `Mubarak! Your shop "${after.name}" is now live in Bahawalnagar.`;
    } else if (after.status === 'suspended') {
      title = '⚠️ Shop Suspended';
      body = 'Your digital storefront has been suspended by the marketplace administrator.';
    }

    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        shopId: context.params.shopId,
        type: 'shop_status',
      },
    };

    return admin.messaging().sendToDevice(fcmToken, payload);
  });
