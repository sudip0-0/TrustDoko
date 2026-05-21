import { PrismaClient } from "@prisma/client";

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
