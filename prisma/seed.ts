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

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
