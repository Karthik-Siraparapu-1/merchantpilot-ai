import {
  PrismaClient,
  UserRole,
  StoreStatus,
  ProductStatus,
  MessageActor,
  RecommendationType,
  RecommendationStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  AIExecutionStatus,
  AuditAction,
  ActorType,
  type Product
} from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for MerchantPilot AI...');

  // ==========================================
  // 1. Merchant & Multi-Role Users
  // ==========================================
  const merchant = await prisma.merchant.upsert({
    where: { slug: 'bharat-crafts' },
    update: {},
    create: {
      name: 'Bharat Crafts & Apparel',
      slug: 'bharat-crafts',
      status: 'ACTIVE'
    }
  });

  // Owner
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@bharatcrafts.com' },
    update: {},
    create: {
      email: 'owner@bharatcrafts.com',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      status: 'ACTIVE'
    }
  });

  await prisma.role.upsert({
    where: {
      merchantId_userId: {
        merchantId: merchant.id,
        userId: ownerUser.id
      }
    },
    update: {},
    create: {
      merchantId: merchant.id,
      userId: ownerUser.id,
      role: UserRole.MERCHANT_OWNER
    }
  });

  // Merchandiser
  const merchandiserUser = await prisma.user.upsert({
    where: { email: 'merchandiser@bharatcrafts.com' },
    update: {},
    create: {
      email: 'merchandiser@bharatcrafts.com',
      firstName: 'Ananya',
      lastName: 'Deshmukh',
      status: 'ACTIVE'
    }
  });

  await prisma.role.upsert({
    where: {
      merchantId_userId: {
        merchantId: merchant.id,
        userId: merchandiserUser.id
      }
    },
    update: {},
    create: {
      merchantId: merchant.id,
      userId: merchandiserUser.id,
      role: UserRole.MERCHANDISER
    }
  });

  // Shoppers
  const shopperPriya = await prisma.user.upsert({
    where: { email: 'shopper.priya@gmail.com' },
    update: {},
    create: {
      email: 'shopper.priya@gmail.com',
      firstName: 'Priya',
      lastName: 'Patel',
      status: 'ACTIVE'
    }
  });

  const shopperRahul = await prisma.user.upsert({
    where: { email: 'shopper.rahul@gmail.com' },
    update: {},
    create: {
      email: 'shopper.rahul@gmail.com',
      firstName: 'Rahul',
      lastName: 'Mehta',
      status: 'ACTIVE'
    }
  });

  const shopperSneha = await prisma.user.upsert({
    where: { email: 'shopper.sneha@gmail.com' },
    update: {},
    create: {
      email: 'shopper.sneha@gmail.com',
      firstName: 'Sneha',
      lastName: 'Reddy',
      status: 'ACTIVE'
    }
  });

  // ==========================================
  // 2. Store, Catalog & Hierarchical Categories
  // ==========================================
  const store = await prisma.store.upsert({
    where: { slug: 'bharat-crafts-main' },
    update: {},
    create: {
      merchantId: merchant.id,
      name: 'Bharat Crafts Flagship Store',
      slug: 'bharat-crafts-main',
      status: StoreStatus.ACTIVE
    }
  });

  const catalog = await prisma.catalog.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      name: 'Main Product Catalog',
      description: 'Handcrafted sarees, ethnic wear, jewelry, and artisanal home decor'
    }
  });

  const catApparel = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'ethnic-apparel' } },
    update: {},
    create: { catalogId: catalog.id, name: 'Ethnic Apparel', slug: 'ethnic-apparel' }
  });

  const catSarees = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'silk-sarees' } },
    update: {},
    create: {
      catalogId: catalog.id,
      parentId: catApparel.id,
      name: 'Silk Sarees',
      slug: 'silk-sarees'
    }
  });

  const catKurtas = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'designer-kurtas' } },
    update: {},
    create: {
      catalogId: catalog.id,
      parentId: catApparel.id,
      name: 'Designer Kurtas',
      slug: 'designer-kurtas'
    }
  });

  const catAccessories = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'fashion-accessories' } },
    update: {},
    create: { catalogId: catalog.id, name: 'Fashion Accessories', slug: 'fashion-accessories' }
  });

  const catJewelry = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'handcrafted-jewelry' } },
    update: {},
    create: { catalogId: catalog.id, name: 'Handcrafted Jewelry', slug: 'handcrafted-jewelry' }
  });

  const catHomeDecor = await prisma.category.upsert({
    where: { catalogId_slug: { catalogId: catalog.id, slug: 'artisanal-home-decor' } },
    update: {},
    create: { catalogId: catalog.id, name: 'Artisanal Home Decor', slug: 'artisanal-home-decor' }
  });

  // ==========================================
  // 3. Comprehensive Product & Inventory Catalog (20 Items)
  // ==========================================
  const rawProducts = [
    // Sarees
    {
      sku: 'SAREE-KANCHI-001',
      title: 'Handloom Kanjeevaram Pure Silk Saree - Crimson Gold',
      slug: 'kanjeevaram-pure-silk-saree-crimson-gold',
      description: 'Authentic handwoven Kanjeevaram pure silk saree with opulent zari border.',
      priceMinor: 1499900, // ₹14,999.00
      categoryId: catSarees.id,
      status: ProductStatus.ACTIVE,
      available: 25,
      reserved: 2,
      reorder: 5
    },
    {
      sku: 'SAREE-BANARASI-002',
      title: 'Banarasi Kadwa Weave Zari Silk Saree - Royal Emerald',
      slug: 'banarasi-kadwa-zari-silk-saree-royal-emerald',
      description:
        'Heirloom quality pure katan silk Banarasi saree adorned with intricate floral jaal.',
      priceMinor: 1249900, // ₹12,499.00
      categoryId: catSarees.id,
      status: ProductStatus.ACTIVE,
      available: 18,
      reserved: 1,
      reorder: 5
    },
    {
      sku: 'SAREE-CHANDERI-003',
      title: 'Handwoven Chanderi Cotton Silk Saree - Pastel Rose',
      slug: 'chanderi-cotton-silk-saree-pastel-rose',
      description: 'Lightweight gossamer Chanderi drape with subtle silver booti work.',
      priceMinor: 489900, // ₹4,899.00
      categoryId: catSarees.id,
      status: ProductStatus.ACTIVE,
      available: 30,
      reserved: 0,
      reorder: 8
    },
    {
      sku: 'SAREE-TUSSAR-004',
      title: 'Tribal Hand-Painted Tussar Silk Saree - Ochre Gold',
      slug: 'tribal-handpainted-tussar-silk-saree-ochre',
      description: 'Rich textured wild Tussar silk featuring heritage Madhubani folk art motifs.',
      priceMinor: 679900, // ₹6,799.00
      categoryId: catSarees.id,
      status: ProductStatus.ACTIVE,
      available: 3, // LOW STOCK
      reserved: 1,
      reorder: 5
    },
    {
      sku: 'SAREE-PATOLA-005',
      title: 'Patan Double Ikat Pure Silk Patola Saree',
      slug: 'patan-double-ikat-pure-silk-patola-saree',
      description:
        'Masterpiece geometric weave using natural dyes and centuries-old double ikat technique.',
      priceMinor: 2499900, // ₹24,999.00
      categoryId: catSarees.id,
      status: ProductStatus.OUT_OF_STOCK,
      available: 0, // OUT OF STOCK
      reserved: 0,
      reorder: 2
    },

    // Kurtas & Apparel
    {
      sku: 'KURTA-CHIKAN-006',
      title: 'Lucknowi Chikankari Pure Georgette Kurta - Ivory White',
      slug: 'lucknowi-chikankari-pure-georgette-kurta-ivory',
      description: 'Intricate shadow work and tepchi embroidery with mukaish embellishments.',
      priceMinor: 349900, // ₹3,499.00
      categoryId: catKurtas.id,
      status: ProductStatus.ACTIVE,
      available: 45,
      reserved: 3,
      reorder: 10
    },
    {
      sku: 'KURTA-ANARKALI-007',
      title: 'Embroidered Floor-Length Silk Anarkali Set - Midnight Navy',
      slug: 'embroidered-silk-anarkali-set-midnight-navy',
      description:
        'Flared festive silhouette crafted from raw silk with churidar and organza dupatta.',
      priceMinor: 599900, // ₹5,999.00
      categoryId: catKurtas.id,
      status: ProductStatus.ACTIVE,
      available: 20,
      reserved: 2,
      reorder: 5
    },
    {
      sku: 'LEHENGA-VELVET-008',
      title: 'Royal Maroon Bridal Velvet Embroidered Lehenga Set',
      slug: 'royal-maroon-bridal-velvet-lehenga-set',
      description: 'Magnificent bridal ensemble hand-embroidered with dabka, sequins, and pearls.',
      priceMinor: 3899900, // ₹38,999.00
      categoryId: catApparel.id,
      status: ProductStatus.ACTIVE,
      available: 4, // LOW STOCK
      reserved: 1,
      reorder: 2
    },

    // Fashion Accessories
    {
      sku: 'ACC-CLUTCH-009',
      title: 'Hand-Embroidered Zardosi Silk Clutch - Radiant Gold',
      slug: 'hand-embroidered-zardosi-silk-clutch-radiant-gold',
      description: 'Elegant golden zardosi evening clutch matching traditional festive wear.',
      priceMinor: 249900, // ₹2,499.00
      categoryId: catAccessories.id,
      status: ProductStatus.ACTIVE,
      available: 40,
      reserved: 1,
      reorder: 10
    },
    {
      sku: 'ACC-POTLI-010',
      title: 'Pearl Beaded Festive Potli Bag - Rose Quartz',
      slug: 'pearl-beaded-festive-potli-bag-rose-quartz',
      description: 'Hand-strung faux pearl and crystal potli with tassel drawstring closures.',
      priceMinor: 179900, // ₹1,799.00
      categoryId: catAccessories.id,
      status: ProductStatus.ACTIVE,
      available: 35,
      reserved: 0,
      reorder: 8
    },
    {
      sku: 'ACC-PASHMINA-011',
      title: 'Authentic Kashmiri Handspun Pashmina Shawl - Sozni Jamawar',
      slug: 'kashmiri-handspun-pashmina-shawl-sozni-jamawar',
      description: 'GI-tagged 100% fine cashmere with ultra-detailed needlework embroidery.',
      priceMinor: 999900, // ₹9,999.00
      categoryId: catAccessories.id,
      status: ProductStatus.ACTIVE,
      available: 12,
      reserved: 1,
      reorder: 3
    },
    {
      sku: 'ACC-DUPATTA-012',
      title: 'Phulkari Handcrafted Heritage Chiffon Dupatta - Multi Bloom',
      slug: 'phulkari-handcrafted-heritage-chiffon-dupatta-multi',
      description: 'Vibrant geometric silk floss embroidery from the artisanal clusters of Punjab.',
      priceMinor: 149900, // ₹1,499.00
      categoryId: catAccessories.id,
      status: ProductStatus.ACTIVE,
      available: 50,
      reserved: 0,
      reorder: 15
    },

    // Handcrafted Jewelry
    {
      sku: 'JWL-KUNDAN-013',
      title: 'Jadau Kundan Choker Necklace Set with Freshwater Pearls',
      slug: 'jadau-kundan-choker-necklace-set-freshwater-pearls',
      description:
        'Royal bridal necklace with matching chandelier jhumkas in 22K gold foil settings.',
      priceMinor: 749900, // ₹7,499.00
      categoryId: catJewelry.id,
      status: ProductStatus.ACTIVE,
      available: 15,
      reserved: 2,
      reorder: 5
    },
    {
      sku: 'JWL-TEMPLE-014',
      title: '22K Gold Plated South Indian Temple Heritage Haram Set',
      slug: 'gold-plated-south-indian-temple-heritage-haram-set',
      description:
        'Embossed Lakshmi and peacock motifs studded with synthetic rubies and emeralds.',
      priceMinor: 899900, // ₹8,999.00
      categoryId: catJewelry.id,
      status: ProductStatus.ACTIVE,
      available: 2, // LOW STOCK
      reserved: 0,
      reorder: 4
    },
    {
      sku: 'JWL-JHUMKA-015',
      title: 'Meenakari Peacock Hand-Painted Chandbali Jhumkas',
      slug: 'meenakari-peacock-handpainted-chandbali-jhumkas',
      description: 'Traditional Jaipur enamel craftsmanship with hanging seed pearl accents.',
      priceMinor: 129900, // ₹1,299.00
      categoryId: catJewelry.id,
      status: ProductStatus.ACTIVE,
      available: 60,
      reserved: 4,
      reorder: 15
    },
    {
      sku: 'JWL-SILVER-016',
      title: '925 Sterling Silver Oxidized Tribal Statement Kada',
      slug: '925-sterling-silver-oxidized-tribal-statement-kada',
      description: 'Solid silver artisan cuff bracelet featuring intricate filigree engravings.',
      priceMinor: 219900, // ₹2,199.00
      categoryId: catJewelry.id,
      status: ProductStatus.ACTIVE,
      available: 28,
      reserved: 0,
      reorder: 6
    },

    // Artisanal Home Decor
    {
      sku: 'HOME-BRASS-017',
      title: 'Handcrafted Antique Finish Brass Dancing Nataraja (12 Inch)',
      slug: 'handcrafted-antique-finish-brass-dancing-nataraja',
      description: 'Lost-wax cast solid brass sculpture representing cosmic rhythm and balance.',
      priceMinor: 649900, // ₹6,499.00
      categoryId: catHomeDecor.id,
      status: ProductStatus.ACTIVE,
      available: 8,
      reserved: 1,
      reorder: 2
    },
    {
      sku: 'HOME-RUG-018',
      title: 'Kashmiri Hand-Knotted Woolen Area Rug (5x7 ft)',
      slug: 'kashmiri-hand-knotted-woolen-area-rug-5x7',
      description: 'Plush botanical medallion weave crafted by master weavers over 4 months.',
      priceMinor: 1850000, // ₹18,500.00
      categoryId: catHomeDecor.id,
      status: ProductStatus.ACTIVE,
      available: 5,
      reserved: 0,
      reorder: 2
    },
    {
      sku: 'HOME-DIYAS-019',
      title: 'Set of 4 Hand-Carved Brass Festive Diya Oil Lamps',
      slug: 'set-of-4-hand-carved-brass-festive-diya-lamps',
      description: 'Artisanal engraved tabletop lamps designed for auspicious celebrations.',
      priceMinor: 119900, // ₹1,199.00
      categoryId: catHomeDecor.id,
      status: ProductStatus.ACTIVE,
      available: 75,
      reserved: 5,
      reorder: 20
    },
    {
      sku: 'HOME-CERAMIC-020',
      title: 'Artisanal Jaipur Blue Pottery Ceramic Dinner Set (18 Pcs)',
      slug: 'artisanal-jaipur-blue-pottery-ceramic-dinner-set-18pcs',
      description:
        'Hand-painted lead-free glazed quartz dinnerware set with timeless floral patterns.',
      priceMinor: 429900, // ₹4,299.00
      categoryId: catHomeDecor.id,
      status: ProductStatus.ACTIVE,
      available: 14,
      reserved: 0,
      reorder: 5
    }
  ];

  const createdProductsMap = new Map<string, Product>();

  for (const item of rawProducts) {
    const product = await prisma.product.upsert({
      where: {
        storeId_sku: {
          storeId: store.id,
          sku: item.sku
        }
      },
      update: {
        title: item.title,
        priceMinor: item.priceMinor,
        status: item.status
      },
      create: {
        storeId: store.id,
        categoryId: item.categoryId,
        title: item.title,
        slug: item.slug,
        sku: item.sku,
        description: item.description,
        priceMinor: item.priceMinor,
        currency: 'INR',
        status: item.status
      }
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {
        availableQuantity: item.available,
        reservedQuantity: item.reserved,
        reorderThreshold: item.reorder
      },
      create: {
        productId: product.id,
        storeId: store.id,
        availableQuantity: item.available,
        reservedQuantity: item.reserved,
        reorderThreshold: item.reorder
      }
    });

    createdProductsMap.set(item.sku, product);
  }

  const getProduct = (sku: string): Product => {
    const p = createdProductsMap.get(sku);
    if (!p) {
      throw new Error(`Seed error: product ${sku} not found`);
    }
    return p;
  };

  // ==========================================
  // 4. Policy & Experimentation
  // ==========================================
  const existingPolicy = await prisma.merchantPolicy.findFirst({
    where: { merchantId: merchant.id, policyName: 'Festive Upsell Policy 2026' }
  });

  const policy =
    existingPolicy ||
    (await prisma.merchantPolicy.create({
      data: {
        merchantId: merchant.id,
        policyName: 'Festive Upsell Policy 2026',
        policyVersion: '1.0.0',
        isActive: true,
        maxDiscountPercent: 12.5,
        minCartValueForUpsell: 500000, // ₹5,000.00
        minConfidenceThreshold: 0.75,
        requireExplanation: true
      }
    }));

  const existingExperiment = await prisma.experiment.findFirst({
    where: { merchantId: merchant.id, name: 'AI Contextual Upsell Prompt Test Q3' },
    include: { variants: true }
  });

  const experiment =
    existingExperiment ||
    (await prisma.experiment.create({
      data: {
        merchantId: merchant.id,
        name: 'AI Contextual Upsell Prompt Test Q3',
        description:
          'Testing personalized basket-aware matching vs baseline static recommendations',
        isActive: true,
        variants: {
          create: [
            {
              name: 'Variant A - Contextual Zari Match',
              promptTemplate: 'Recommend clutch matching saree color and zari type',
              trafficAllocation: 0.5
            },
            {
              name: 'Variant B - High Revenue Lift Focus',
              promptTemplate: 'Recommend top revenue margin accessory',
              trafficAllocation: 0.5
            }
          ]
        }
      },
      include: { variants: true }
    }));

  const activeVariant = experiment.variants[0];

  // ==========================================
  // 5. Conversational Interaction & AI Recommendation
  // ==========================================
  const sareeKanchi = getProduct('SAREE-KANCHI-001');
  const clutchGold = getProduct('ACC-CLUTCH-009');
  const jhumkaMeenakari = getProduct('JWL-JHUMKA-015');
  const banarasiSaree = getProduct('SAREE-BANARASI-002');
  const lehengaVelvet = getProduct('LEHENGA-VELVET-008');
  const kurtiChikan = getProduct('KURTA-CHIKAN-006');
  const potliRose = getProduct('ACC-POTLI-010');

  const conversation = await prisma.conversation.create({
    data: {
      merchantId: merchant.id,
      storeId: store.id,
      customerId: shopperPriya.id
    }
  });

  const shopperMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      merchantId: merchant.id,
      actor: MessageActor.SHOPPER,
      content: 'I am looking for a silk saree for a wedding reception. Any matching accessories?'
    }
  });

  const aiExecution = await prisma.aIExecution.create({
    data: {
      merchantId: merchant.id,
      messageId: shopperMessage.id,
      intent: 'FESTIVE_SHOPPING_WITH_ACCESSORY_MATCH',
      retrievedProducts: [sareeKanchi.id, clutchGold.id],
      candidateProducts: [clutchGold.id],
      rankingScores: { [clutchGold.id]: 0.94 },
      selectedProduct: clutchGold.id,
      confidence: 0.94,
      revenueScore: 0.88,
      merchantPolicyVersion: policy.policyVersion,
      explanation:
        'Zardosi Golden Clutch perfectly complements the crimson-gold Kanjeevaram saree border.',
      model: 'gemini-1.5-pro',
      latency: 420,
      tokensUsed: 650,
      status: AIExecutionStatus.SUCCESS
    }
  });

  const recommendation = await prisma.recommendation.create({
    data: {
      conversationId: conversation.id,
      messageId: shopperMessage.id,
      merchantId: merchant.id,
      experimentId: experiment.id,
      variantId: activeVariant ? activeVariant.id : null,
      aiExecutionId: aiExecution.id,
      confidence: 0.94,
      explanation:
        'Pair your Kanjeevaram Saree with this Zardosi Silk Clutch for a complete wedding look!',
      revenueLiftPrediction: 16.6,
      recommendationType: RecommendationType.UPSELL,
      status: RecommendationStatus.ACCEPTED,
      reasons: {
        create: [
          {
            code: 'COLOR_HARMONY',
            reason: 'Matching Gold Zari Craftsmanship',
            score: 0.95
          },
          {
            code: 'HIGH_CONVERSION_PAIR',
            reason: '84% of shoppers who bought Kanjeevaram sarees added this clutch',
            score: 0.89
          }
        ]
      }
    }
  });

  // ==========================================
  // 6. Realistic Orders Matrix across Customer Base
  // ==========================================
  const seedOrders = [
    {
      orderNumber: 'ORD-20260904-1001',
      customer: shopperPriya,
      status: OrderStatus.PAID,
      items: [
        { product: sareeKanchi, qty: 1, priceMinor: 1499900 },
        { product: clutchGold, qty: 1, priceMinor: 249900 }
      ],
      totalMinor: 1749800
    },
    {
      orderNumber: 'ORD-20260904-1002',
      customer: shopperRahul,
      status: OrderStatus.SHIPPED,
      items: [
        { product: banarasiSaree, qty: 1, priceMinor: 1249900 },
        { product: jhumkaMeenakari, qty: 2, priceMinor: 129900 }
      ],
      totalMinor: 1509700
    },
    {
      orderNumber: 'ORD-20260904-1003',
      customer: shopperSneha,
      status: OrderStatus.DELIVERED,
      items: [{ product: lehengaVelvet, qty: 1, priceMinor: 3899900 }],
      totalMinor: 3899900
    },
    {
      orderNumber: 'ORD-20260904-1004',
      customer: shopperPriya,
      status: OrderStatus.PROCESSING,
      items: [
        { product: kurtiChikan, qty: 2, priceMinor: 349900 },
        { product: potliRose, qty: 1, priceMinor: 179900 }
      ],
      totalMinor: 879700
    },
    {
      orderNumber: 'ORD-20260904-1005',
      customer: shopperRahul,
      status: OrderStatus.CANCELLED,
      items: [{ product: getProduct('HOME-RUG-018'), qty: 1, priceMinor: 1850000 }],
      totalMinor: 1850000
    },
    {
      orderNumber: 'ORD-20260904-1006',
      customer: shopperSneha,
      status: OrderStatus.PAID,
      items: [
        { product: getProduct('JWL-KUNDAN-013'), qty: 1, priceMinor: 749900 },
        { product: getProduct('HOME-BRASS-017'), qty: 1, priceMinor: 649900 }
      ],
      totalMinor: 1399800
    }
  ];

  for (const ord of seedOrders) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber }
    });

    if (!existingOrder) {
      const createdOrder = await prisma.order.create({
        data: {
          merchantId: merchant.id,
          storeId: store.id,
          customerId: ord.customer.id,
          orderNumber: ord.orderNumber,
          razorpayOrderId: `order_test_${Math.random().toString(36).substring(2, 9)}`,
          status: ord.status,
          totalAmountMinor: ord.totalMinor,
          currency: 'INR',
          items: {
            create: ord.items.map((i) => ({
              productId: i.product.id,
              title: i.product.title,
              sku: i.product.sku,
              quantity: i.qty,
              priceMinor: i.priceMinor
            }))
          }
        }
      });

      if (
        ord.status === OrderStatus.PAID ||
        ord.status === OrderStatus.SHIPPED ||
        ord.status === OrderStatus.DELIVERED
      ) {
        await prisma.payment.create({
          data: {
            merchantId: merchant.id,
            orderId: createdOrder.id,
            razorpayOrderId: createdOrder.razorpayOrderId ?? `order_test_${Date.now()}`,
            razorpayPaymentId: `pay_test_${Math.random().toString(36).substring(2, 9)}`,
            razorpaySignature: 'sig_test_mocked_hash',
            amountMinor: ord.totalMinor,
            currency: 'INR',
            status: PaymentStatus.CAPTURED,
            method: PaymentMethod.RAZORPAY_TEST
          }
        });
      }
    }
  }

  // ==========================================
  // 7. AuditLog, Webhooks & Analytics Lift
  // ==========================================
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
      afterState: { recommendationId: recommendation.id, confidence: 0.94 }
    }
  });

  console.log('✅ Comprehensive database seed completed successfully!');
  console.log(
    `📦 Seeded: 1 Merchant, 1 Store, 6 Categories, 20 Products, 20 Inventories, 6 Realistic Orders.`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
