import { PrismaClient, UserRole, StoreStatus, ProductStatus, MessageActor, RecommendationType, RecommendationStatus, CartStatus, OrderStatus, PaymentStatus, PaymentMethod, AIExecutionStatus, AuditAction, ActorType, AnalyticsEventType } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Merchant & User
  const merchant = await prisma.merchant.upsert({
    where: { slug: 'bharat-crafts' },
    update: {},
    create: {
      name: 'Bharat Crafts & Apparel',
      slug: 'bharat-crafts',
      status: 'ACTIVE',
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@bharatcrafts.com' },
    update: {},
    create: {
      email: 'owner@bharatcrafts.com',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      status: 'ACTIVE',
    },
  });

  const shopperUser = await prisma.user.upsert({
    where: { email: 'shopper.priya@gmail.com' },
    update: {},
    create: {
      email: 'shopper.priya@gmail.com',
      firstName: 'Priya',
      lastName: 'Patel',
      status: 'ACTIVE',
    },
  });

  await prisma.role.upsert({
    where: {
      merchantId_userId: {
        merchantId: merchant.id,
        userId: ownerUser.id,
      },
    },
    update: {},
    create: {
      merchantId: merchant.id,
      userId: ownerUser.id,
      role: UserRole.MERCHANT_OWNER,
    },
  });

  // 2. Store & Catalog & Categories
  const store = await prisma.store.upsert({
    where: { slug: 'bharat-crafts-main' },
    update: {},
    create: {
      merchantId: merchant.id,
      name: 'Bharat Crafts Flagship Store',
      slug: 'bharat-crafts-main',
      status: StoreStatus.ACTIVE,
    },
  });

  const catalog = await prisma.catalog.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      name: 'Main Product Catalog',
      description: 'Handcrafted sarees, ethnic wear, and artisanal home decor',
    },
  });

  const categoryApparel = await prisma.category.upsert({
    where: {
      catalogId_slug: {
        catalogId: catalog.id,
        slug: 'ethnic-apparel',
      },
    },
    update: {},
    create: {
      catalogId: catalog.id,
      name: 'Ethnic Apparel',
      slug: 'ethnic-apparel',
    },
  });

  const categorySarees = await prisma.category.upsert({
    where: {
      catalogId_slug: {
        catalogId: catalog.id,
        slug: 'silk-sarees',
      },
    },
    update: {},
    create: {
      catalogId: catalog.id,
      parentId: categoryApparel.id,
      name: 'Silk Sarees',
      slug: 'silk-sarees',
    },
  });

  // 3. Products & Inventories
  const sareeProduct = await prisma.product.upsert({
    where: {
      storeId_sku: {
        storeId: store.id,
        sku: 'SAREE-KANCHI-001',
      },
    },
    update: {},
    create: {
      storeId: store.id,
      categoryId: categorySarees.id,
      title: 'Handloom Kanjeevaram Pure Silk Saree - Crimson Gold',
      slug: 'kanjeevaram-pure-silk-saree-crimson-gold',
      sku: 'SAREE-KANCHI-001',
      description: 'Authentic handwoven Kanjeevaram pure silk saree with zari border',
      priceMinor: 1499900, // ₹14,999.00
      currency: 'INR',
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.inventory.upsert({
    where: { productId: sareeProduct.id },
    update: {},
    create: {
      productId: sareeProduct.id,
      storeId: store.id,
      availableQuantity: 25,
      reservedQuantity: 2,
      reorderThreshold: 5,
    },
  });

  const clutchProduct = await prisma.product.upsert({
    where: {
      storeId_sku: {
        storeId: store.id,
        sku: 'ACC-CLUTCH-002',
      },
    },
    update: {},
    create: {
      storeId: store.id,
      categoryId: categoryApparel.id,
      title: 'Hand-Embroidered Zardosi Silk Clutch',
      slug: 'zardosi-silk-clutch-gold',
      sku: 'ACC-CLUTCH-002',
      description: 'Elegant golden zardosi clutch matching traditional festive wear',
      priceMinor: 249900, // ₹2,499.00
      currency: 'INR',
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.inventory.upsert({
    where: { productId: clutchProduct.id },
    update: {},
    create: {
      productId: clutchProduct.id,
      storeId: store.id,
      availableQuantity: 40,
      reservedQuantity: 1,
      reorderThreshold: 10,
    },
  });

  // 4. Policy & Experiment
  const policy = await prisma.merchantPolicy.create({
    create: {
      merchantId: merchant.id,
      policyName: 'Festive Upsell Policy 2026',
      policyVersion: '1.0.0',
      isActive: true,
      maxDiscountPercent: 12.5,
      minCartValueForUpsell: 500000, // ₹5,000.00
      minConfidenceThreshold: 0.75,
      requireExplanation: true,
    },
  });

  const experiment = await prisma.experiment.create({
    data: {
      merchantId: merchant.id,
      name: 'AI Contextual Upsell Prompt Test Q3',
      description: 'Testing personalized basket-aware matching vs baseline static recommendations',
      isActive: true,
      variants: {
        create: [
          {
            name: 'Variant A - Contextual Zari Match',
            promptTemplate: 'Recommend clutch matching saree color and zari type',
            trafficAllocation: 0.5,
          },
          {
            name: 'Variant B - High Revenue Lift Focus',
            promptTemplate: 'Recommend top revenue margin accessory',
            trafficAllocation: 0.5,
          },
        ],
      },
    },
    include: { variants: true },
  });

  const activeVariant = experiment.variants[0];

  // 5. Conversation, Message, AI Execution & Recommendation
  const conversation = await prisma.conversation.create({
    data: {
      merchantId: merchant.id,
      storeId: store.id,
      customerId: shopperUser.id,
    },
  });

  const shopperMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      merchantId: merchant.id,
      actor: MessageActor.SHOPPER,
      content: 'I am looking for a silk saree for a wedding reception. Any matching accessories?',
    },
  });

  const aiExecution = await prisma.aIExecution.create({
    data: {
      merchantId: merchant.id,
      messageId: shopperMessage.id,
      intent: 'FESTIVE_SHOPPING_WITH_ACCESSORY_MATCH',
      retrievedProducts: [sareeProduct.id, clutchProduct.id],
      candidateProducts: [clutchProduct.id],
      rankingScores: { [clutchProduct.id]: 0.94 },
      selectedProduct: clutchProduct.id,
      confidence: 0.94,
      revenueScore: 0.88,
      merchantPolicyVersion: policy.policyVersion,
      explanation: 'Zardosi Golden Clutch perfectly complements the crimson-gold Kanjeevaram saree border.',
      model: 'gemini-1.5-pro',
      latency: 420,
      tokensUsed: 650,
      status: AIExecutionStatus.SUCCESS,
    },
  });

  const recommendation = await prisma.recommendation.create({
    data: {
      conversationId: conversation.id,
      messageId: shopperMessage.id,
      merchantId: merchant.id,
      experimentId: experiment.id,
      variantId: activeVariant.id,
      aiExecutionId: aiExecution.id,
      confidence: 0.94,
      explanation: 'Pair your Kanjeevaram Saree with this Zardosi Silk Clutch for a complete wedding look!',
      revenueLiftPrediction: 16.6,
      recommendationType: RecommendationType.UPSELL,
      status: RecommendationStatus.ACCEPTED,
      reasons: {
        create: [
          {
            code: 'COLOR_HARMONY',
            reason: 'Matching Gold Zari Craftsmanship',
            score: 0.95,
          },
          {
            code: 'HIGH_CONVERSION_PAIR',
            reason: '84% of shoppers who bought Kanjeevaram sarees added this clutch',
            score: 0.89,
          },
        ],
      },
    },
  });

  // 6. Cart, Order & Payment
  const cart = await prisma.cart.create({
    data: {
      merchantId: merchant.id,
      storeId: store.id,
      customerId: shopperUser.id,
      conversationId: conversation.id,
      status: CartStatus.CONVERTED,
      items: {
        create: [
          {
            productId: sareeProduct.id,
            quantity: 1,
            priceMinor: 1499900,
          },
          {
            productId: clutchProduct.id,
            quantity: 1,
            priceMinor: 249900,
          },
        ],
      },
    },
  });

  const orderNumber = `ORD-20260903-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = await prisma.order.create({
    data: {
      merchantId: merchant.id,
      storeId: store.id,
      customerId: shopperUser.id,
      conversationId: conversation.id,
      cartId: cart.id,
      orderNumber,
      razorpayOrderId: `order_test_${Date.now()}`,
      status: OrderStatus.PAID,
      totalAmountMinor: 1749800, // ₹17,498.00
      currency: 'INR',
      items: {
        create: [
          {
            productId: sareeProduct.id,
            title: sareeProduct.title,
            sku: sareeProduct.sku,
            quantity: 1,
            priceMinor: 1499900,
          },
          {
            productId: clutchProduct.id,
            title: clutchProduct.title,
            sku: clutchProduct.sku,
            quantity: 1,
            priceMinor: 249900,
          },
        ],
      },
    },
  });

  const payment = await prisma.payment.create({
    data: {
      merchantId: merchant.id,
      orderId: order.id,
      razorpayOrderId: order.razorpayOrderId!,
      razorpayPaymentId: `pay_test_${Date.now()}`,
      razorpaySignature: 'sig_test_mocked_hash',
      amountMinor: 1749800,
      currency: 'INR',
      status: PaymentStatus.CAPTURED,
      method: PaymentMethod.RAZORPAY_TEST,
    },
  });

  // 7. AuditLog, Webhook & Analytics
  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      userId: ownerUser.id,
      aiExecutionId: aiExecution.id,
      actorType: ActorType.AI_AGENT,
      actorId: 'merchantpilot-ai-growth-agent',
      actorIp: '127.0.0.1',
      action: AuditAction.AI_DECISION,
      correlationId: `req-${Date.now()}`,
      entityName: 'Recommendation',
      entityId: recommendation.id,
      beforeState: {},
      afterState: { recommendationId: recommendation.id, confidence: 0.94 },
    },
  });

  await prisma.webhookEvent.create({
    data: {
      merchantId: merchant.id,
      paymentId: payment.id,
      eventId: `evt_${Date.now()}`,
      eventType: 'payment.captured',
      payload: {
        entity: 'event',
        event: 'payment.captured',
        contains: ['payment'],
        payload: { payment: { entity: { id: payment.razorpayPaymentId, amount: 1749800 } } },
      },
      status: 'PROCESSED',
      processedAt: new Date(),
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      merchantId: merchant.id,
      storeId: store.id,
      customerId: shopperUser.id,
      conversationId: conversation.id,
      recommendationId: recommendation.id,
      experimentId: experiment.id,
      variantId: activeVariant.id,
      orderId: order.id,
      eventType: AnalyticsEventType.REVENUE_ATTRIBUTED,
      revenueAmount: 249900, // ₹2,499.00 attributed lift
      currency: 'INR',
      metadata: { source: 'conversational_upsell_clutch' },
    },
  });

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
