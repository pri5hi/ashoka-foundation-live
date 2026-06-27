import { GraduationCap, Sparkles, Utensils, PawPrint, Leaf, type LucideIcon } from "lucide-react";
import causeWomen from "@/assets/cause-women.jpg";
import causeFood from "@/assets/cause-food.jpg";
import udaanHeader from "@/assets/udaan/Udaan_Header.jpg.asset.json";
import hjaHeader from "@/assets/har-jeevan-anmol/HarJeevanAnmol_Header.jpg.asset.json";
import vasundharaHeader from "@/assets/vasundhara/Vasundhara_Header.jpg.asset.json";


export type Initiative = {
  slug: string;
  name: string;
  category: string;
  shortDesc: string;
  description: string;
  impactGoal: string;
  image: string;
  icon: LucideIcon;
};

export const initiatives: Initiative[] = [
  {
    slug: "udaan",
    name: "UDAAN",
    category: "Education Support Program",
    shortDesc:
      "Providing learning materials, tuition support, mentorship, and academic guidance to underprivileged children and youth.",
    description:
      "UDAAN is our flagship education initiative dedicated to opening doors of opportunity for children and youth from underprivileged backgrounds. Through learning materials, after-school tuition, mentorship circles and academic guidance, we ensure that no child is held back by circumstance. The program partners with local schools, volunteers and educators to deliver continuous, structured support — from foundational literacy to career counselling.",
    impactGoal:
      "Empower 5,000+ children with quality education access, mentorship, and the confidence to dream beyond their circumstances.",
    image: udaanHeader.url,
    icon: GraduationCap,
  },
  {
    slug: "swabhimaan",
    name: "SWABHIMAAN",
    category: "Women Empowerment Initiative",
    shortDesc:
      "Skill training, livelihood support and rights awareness empowering women to build dignified, independent lives.",
    description:
      "SWABHIMAAN — dignity through self-reliance. The initiative offers vocational training, micro-enterprise support, legal and rights awareness, and confidence-building workshops for women from underserved communities. We partner with trainers, mentors and local enterprises to turn skills into sustainable livelihoods.",
    impactGoal:
      "Train and empower 2,000+ women with marketable skills, financial literacy and the confidence to lead.",
    image: causeWomen,
    icon: Sparkles,
  },
  {
    slug: "ann-se-ashirwad",
    name: "ANN SE ASHIRWAD",
    category: "Food for the Needy Initiative",
    shortDesc:
      "Distributing nutritious meals and essential food supplies to families and individuals in need.",
    description:
      "ANN SE ASHIRWAD addresses hunger at its root. Through daily meal drives, ration kit distribution and community kitchens, we serve nutritious food to families, daily-wage workers, the elderly and anyone in crisis. Every meal carries dignity, warmth and the assurance that no one in our community has to sleep hungry.",
    impactGoal:
      "Serve 1,00,000+ nutritious meals annually and supply monthly ration kits to vulnerable families across our service areas.",
    image: causeFood,
    icon: Utensils,
  },
  {
    slug: "har-jeevan-anmol",
    name: "HAR JEEVAN ANMOL",
    category: "Animal Welfare Program",
    shortDesc:
      "Dedicated to the care, protection, feeding, and welfare of animals in our communities.",
    description:
      "HAR JEEVAN ANMOL — every life is precious. This program is built around compassion for street and stray animals: daily feeding routes, rescue and medical assistance, sterilization drives, and shelter support. We work with vets and volunteers to ensure animals in distress receive timely care.",
    impactGoal:
      "Provide daily care, food and medical support to 1,000+ stray animals while building a network of community caregivers.",
    image: hjaHeader.url,
    icon: PawPrint,
  },
  {
    slug: "vasundhara",
    name: "VASUNDHARA",
    category: "Environment Conservation Drive",
    shortDesc:
      "Plantation drives, cleanliness campaigns, environmental awareness, and sustainable community development.",
    description:
      "VASUNDHARA is our pledge to the planet. We organise large-scale plantation drives, neighbourhood cleanliness campaigns, awareness workshops in schools and sustainability programs with local resident groups. Every sapling planted and every campaign run is a step toward greener, healthier communities.",
    impactGoal:
      "Plant 25,000+ trees, run 100+ community cleanliness drives and educate the next generation on sustainable living.",
    image: vasundharaHeader.url,
    icon: Leaf,
  },
];
