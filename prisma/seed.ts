import {
  BusinessClaimMethod,
  BusinessClaimStatus,
  ClaimStatus,
  ComplaintCategory,
  ComplaintSeverity,
  ComplaintStatus,
  PrismaClient,
  VerificationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Online Clothing",
    slug: "online-clothing",
    description: "Fashion and apparel sold online",
  },
  {
    name: "Electronics and Mobile",
    slug: "electronics-mobile",
    description: "Phones, gadgets, and electronics sellers",
  },
  {
    name: "Beauty and Cosmetics",
    slug: "beauty-cosmetics",
    description: "Skincare, makeup, and beauty products",
  },
  {
    name: "Travel and Tours",
    slug: "travel-tours",
    description: "Travel agencies and tour operators",
  },
  {
    name: "Food and Cloud Kitchen",
    slug: "food-cloud-kitchen",
    description: "Online food delivery and cloud kitchens",
  },
  {
    name: "Repair Services",
    slug: "repair-services",
    description: "Device and appliance repair providers",
  },
  {
    name: "Education Consultancy",
    slug: "education-consultancy",
    description: "Study abroad and education consultants",
  },
  {
    name: "Home Services",
    slug: "home-services",
    description: "Cleaning, plumbing, and home maintenance",
  },
  {
    name: "Health and Dental",
    slug: "health-dental",
    description: "Clinics and health service providers",
  },
  {
    name: "Event Vendors",
    slug: "event-vendors",
    description: "Wedding, party, and event suppliers",
  },
] as const;

/** Sample businesses — clearly fake seed data for local development. */
const sampleBusinesses = [
  {
    name: "[Sample] Kathmandu Threads",
    slug: "sample-kathmandu-threads",
    description: "Demo online clothing store based in Kathmandu.",
    categorySlug: "online-clothing",
    city: "Kathmandu",
    province: "Bagmati",
    instagramUrl: "https://instagram.com/sample-kathmandu-threads",
    trustScore: 72,
    averageRating: 4.2,
    reviewCount: 18,
    complaintCount: 1,
  },
  {
    name: "[Sample] Pokhara Outfit Co.",
    slug: "sample-pokhara-outfit-co",
    description: "Demo apparel seller shipping across Nepal.",
    categorySlug: "online-clothing",
    city: "Pokhara",
    province: "Gandaki",
    trustScore: 65,
    averageRating: 3.9,
    reviewCount: 11,
    complaintCount: 2,
  },
  {
    name: "[Sample] Valley Mobile Hub",
    slug: "sample-valley-mobile-hub",
    description: "Demo electronics and mobile accessories shop.",
    categorySlug: "electronics-mobile",
    city: "Lalitpur",
    province: "Bagmati",
    facebookUrl: "https://facebook.com/sample-valley-mobile-hub",
    trustScore: 58,
    averageRating: 3.6,
    reviewCount: 24,
    complaintCount: 4,
  },
  {
    name: "[Sample] Himalayan Gadgets",
    slug: "sample-himalayan-gadgets",
    description: "Demo seller for phones, earbuds, and chargers.",
    categorySlug: "electronics-mobile",
    city: "Kathmandu",
    province: "Bagmati",
    trustScore: 81,
    averageRating: 4.5,
    reviewCount: 42,
    complaintCount: 0,
  },
  {
    name: "[Sample] Glow Nepal Beauty",
    slug: "sample-glow-nepal-beauty",
    description: "Demo cosmetics and skincare online store.",
    categorySlug: "beauty-cosmetics",
    city: "Bhaktapur",
    province: "Bagmati",
    instagramUrl: "https://instagram.com/sample-glow-nepal",
    trustScore: 69,
    averageRating: 4.0,
    reviewCount: 15,
    complaintCount: 1,
  },
  {
    name: "[Sample] Everest Trek Desk",
    slug: "sample-everest-trek-desk",
    description: "Demo travel and trekking agency.",
    categorySlug: "travel-tours",
    city: "Kathmandu",
    province: "Bagmati",
    websiteUrl: "https://example.com/sample-everest-trek",
    trustScore: 77,
    averageRating: 4.3,
    reviewCount: 31,
    complaintCount: 2,
  },
  {
    name: "[Sample] Momo Cloud Kitchen",
    slug: "sample-momo-cloud-kitchen",
    description: "Demo cloud kitchen for online food orders.",
    categorySlug: "food-cloud-kitchen",
    city: "Kathmandu",
    province: "Bagmati",
    trustScore: 74,
    averageRating: 4.1,
    reviewCount: 56,
    complaintCount: 3,
  },
  {
    name: "[Sample] FixIt Laptop Clinic",
    slug: "sample-fixit-laptop-clinic",
    description: "Demo repair service for laptops and phones.",
    categorySlug: "repair-services",
    city: "Pokhara",
    province: "Gandaki",
    trustScore: 63,
    averageRating: 3.7,
    reviewCount: 9,
    complaintCount: 2,
  },
  {
    name: "[Sample] StudyBridge Consultancy",
    slug: "sample-studybridge-consultancy",
    description: "Demo education consultancy for abroad study.",
    categorySlug: "education-consultancy",
    city: "Kathmandu",
    province: "Bagmati",
    trustScore: 55,
    averageRating: 3.4,
    reviewCount: 8,
    complaintCount: 5,
  },
  {
    name: "[Sample] CleanHome Nepal",
    slug: "sample-cleanhome-nepal",
    description: "Demo home cleaning and maintenance services.",
    categorySlug: "home-services",
    city: "Lalitpur",
    province: "Bagmati",
    trustScore: 70,
    averageRating: 4.0,
    reviewCount: 13,
    complaintCount: 1,
  },
  {
    name: "[Sample] Smile Dental Online",
    slug: "sample-smile-dental-online",
    description: "Demo dental clinic appointment and inquiry page.",
    categorySlug: "health-dental",
    city: "Kathmandu",
    province: "Bagmati",
    trustScore: 84,
    averageRating: 4.6,
    reviewCount: 27,
    complaintCount: 0,
  },
  {
    name: "[Sample] WeddingCraft Nepal",
    slug: "sample-weddingcraft-nepal",
    description: "Demo event vendor for weddings and parties.",
    categorySlug: "event-vendors",
    city: "Chitwan",
    province: "Bagmati",
    trustScore: 61,
    averageRating: 3.8,
    reviewCount: 6,
    complaintCount: 1,
  },
] as const;

async function main() {
  const categoryBySlug = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
    categoryBySlug.set(record.slug, record.id);
  }

  console.log(`Seeded ${categories.length} categories.`);

  for (const business of sampleBusinesses) {
    const categoryId = categoryBySlug.get(business.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category: ${business.categorySlug}`);
    }

    await prisma.business.upsert({
      where: { slug: business.slug },
      update: {
        name: business.name,
        description: business.description,
        categoryId,
        city: business.city,
        province: business.province,
        facebookUrl: "facebookUrl" in business ? business.facebookUrl : null,
        instagramUrl:
          "instagramUrl" in business ? business.instagramUrl : null,
        websiteUrl: "websiteUrl" in business ? business.websiteUrl : null,
        trustScore: business.trustScore,
        averageRating: business.averageRating,
        reviewCount: business.reviewCount,
        complaintCount: business.complaintCount,
        businessType: "ONLINE_ONLY",
      },
      create: {
        name: business.name,
        slug: business.slug,
        description: business.description,
        categoryId,
        city: business.city,
        province: business.province,
        facebookUrl: "facebookUrl" in business ? business.facebookUrl : null,
        instagramUrl:
          "instagramUrl" in business ? business.instagramUrl : null,
        websiteUrl: "websiteUrl" in business ? business.websiteUrl : null,
        trustScore: business.trustScore,
        averageRating: business.averageRating,
        reviewCount: business.reviewCount,
        complaintCount: business.complaintCount,
        businessType: "ONLINE_ONLY",
      },
    });
  }

  console.log(`Seeded ${sampleBusinesses.length} sample businesses.`);

  const reviewer = await prisma.user.upsert({
    where: { email: "sample-reviewer@trustdoko.local" },
    update: { name: "Sample Reviewer" },
    create: {
      email: "sample-reviewer@trustdoko.local",
      name: "Sample Reviewer",
    },
  });

  const sampleReviews = [
    {
      businessSlug: "sample-himalayan-gadgets",
      rating: 5,
      title: "Genuine products",
      body: "Ordered earbuds and they matched the listing. Delivery to Kathmandu took 3 days.",
    },
    {
      businessSlug: "sample-momo-cloud-kitchen",
      rating: 4,
      title: "Good momos",
      body: "Tasted fresh and well packed. Slightly late delivery during rain.",
    },
  ] as const;

  for (const item of sampleReviews) {
    const business = await prisma.business.findUnique({
      where: { slug: item.businessSlug },
      select: { id: true },
    });
    if (!business) {
      continue;
    }

    await prisma.review.upsert({
      where: {
        businessId_userId: {
          businessId: business.id,
          userId: reviewer.id,
        },
      },
      update: {
        rating: item.rating,
        title: item.title,
        body: item.body,
        status: "APPROVED",
      },
      create: {
        businessId: business.id,
        userId: reviewer.id,
        rating: item.rating,
        title: item.title,
        body: item.body,
        status: "APPROVED",
      },
    });
  }

  console.log(`Seeded ${sampleReviews.length} sample approved reviews.`);

  const sampleOwner = await prisma.user.upsert({
    where: { email: "sample-owner@trustdoko.local" },
    update: { name: "Sample Business Owner", role: "BUSINESS" },
    create: {
      email: "sample-owner@trustdoko.local",
      name: "Sample Business Owner",
      role: "BUSINESS",
    },
  });

  const valleyMobile = await prisma.business.findUnique({
    where: { slug: "sample-valley-mobile-hub" },
    select: { id: true },
  });

  if (valleyMobile) {
    await prisma.businessClaim.upsert({
      where: {
        id: "seed-valley-mobile-claim",
      },
      update: {
        status: BusinessClaimStatus.APPROVED,
        ownerName: "Sample Business Owner",
        ownerEmail: "sample-owner@trustdoko.local",
        ownerPhone: "+9779800000000",
        method: BusinessClaimMethod.EMAIL,
        message:
          "I am the authorized operator of Valley Mobile Hub and can verify via business email.",
      },
      create: {
        id: "seed-valley-mobile-claim",
        businessId: valleyMobile.id,
        userId: sampleOwner.id,
        ownerName: "Sample Business Owner",
        ownerEmail: "sample-owner@trustdoko.local",
        ownerPhone: "+9779800000000",
        method: BusinessClaimMethod.EMAIL,
        message:
          "I am the authorized operator of Valley Mobile Hub and can verify via business email.",
        status: BusinessClaimStatus.APPROVED,
      },
    });

    await prisma.business.update({
      where: { id: valleyMobile.id },
      data: {
        claimStatus: ClaimStatus.CLAIMED,
        claimedByUserId: sampleOwner.id,
        verificationStatus: VerificationStatus.CONTACT_VERIFIED,
      },
    });
  }

  const sampleAdmin = await prisma.user.upsert({
    where: { email: "admin@trustdoko.local" },
    update: { name: "Sample Admin", role: "ADMIN" },
    create: {
      email: "admin@trustdoko.local",
      name: "Sample Admin",
      role: "ADMIN",
    },
  });

  void sampleAdmin;

  await prisma.complaint.deleteMany({
    where: {
      business: {
        slug: {
          in: ["sample-valley-mobile-hub", "sample-kathmandu-threads"],
        },
      },
    },
  });

  const sampleComplaints = [
    {
      businessSlug: "sample-valley-mobile-hub",
      userId: reviewer.id,
      category: ComplaintCategory.NON_DELIVERY,
      summary: "Phone order never arrived after two weeks of promises.",
      description:
        "I paid in advance for a smartphone in January and the seller stopped replying after the second week. No tracking number was provided.",
      status: ComplaintStatus.SUBMITTED,
      severity: ComplaintSeverity.MEDIUM,
      daysAgo: 12,
    },
    {
      businessSlug: "sample-valley-mobile-hub",
      userId: reviewer.id,
      category: ComplaintCategory.FAKE_PRODUCT,
      summary: "Received a counterfeit device that failed activation.",
      description:
        "The IMEI did not validate and the packaging differed from the official brand. Seller refused a refund when I raised fraud concerns.",
      status: ComplaintStatus.UNDER_REVIEW,
      severity: ComplaintSeverity.HIGH,
      daysAgo: 8,
    },
    {
      businessSlug: "sample-valley-mobile-hub",
      userId: reviewer.id,
      category: ComplaintCategory.REFUND_ISSUE,
      summary: "Refund promised but not processed after return.",
      description:
        "I returned a defective charger and was told a refund would arrive within 7 days. It has been over a month with no payment.",
      status: ComplaintStatus.RESOLVED,
      severity: ComplaintSeverity.MEDIUM,
      daysAgo: 30,
    },
    {
      businessSlug: "sample-valley-mobile-hub",
      userId: reviewer.id,
      category: ComplaintCategory.NO_RESPONSE,
      summary: "No reply to multiple messages about order status.",
      description:
        "I messaged on Instagram and email five times over two weeks about a pending order. No response at all.",
      status: ComplaintStatus.UNRESOLVED,
      severity: ComplaintSeverity.MEDIUM,
      daysAgo: 20,
    },
    {
      businessSlug: "sample-kathmandu-threads",
      userId: reviewer.id,
      category: ComplaintCategory.MISLEADING_PRICING,
      summary: "Checkout price higher than advertised on social media.",
      description:
        "The Instagram post showed NPR 1,200 per item but at checkout I was charged NPR 1,800 without explanation. Support did not clarify.",
      status: ComplaintStatus.RESOLVED,
      severity: ComplaintSeverity.MEDIUM,
      daysAgo: 45,
    },
  ] as const;

  for (const item of sampleComplaints) {
    const business = await prisma.business.findUnique({
      where: { slug: item.businessSlug },
      select: { id: true },
    });
    if (!business) {
      continue;
    }

    const experienceDate = new Date();
    experienceDate.setDate(experienceDate.getDate() - item.daysAgo);

    await prisma.complaint.create({
      data: {
        businessId: business.id,
        userId: item.userId,
        category: item.category,
        summary: item.summary,
        description: item.description,
        experienceDate,
        status: item.status,
        severity: item.severity,
        allowAdminContact: true,
      },
    });
  }

  for (const slug of ["sample-valley-mobile-hub", "sample-kathmandu-threads"]) {
    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!business) {
      continue;
    }
    const count = await prisma.complaint.count({
      where: {
        businessId: business.id,
        status: { not: ComplaintStatus.REJECTED },
      },
    });
    await prisma.business.update({
      where: { id: business.id },
      data: { complaintCount: count },
    });
  }

  console.log(`Seeded ${sampleComplaints.length} sample complaints.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
