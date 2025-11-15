import Link from "next/link"
import { 
  Laptop, 
  Stethoscope, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  ShoppingBag,
  Wrench,
  Palette,
  TrendingUp,
  Heart,
  Scale,
  Megaphone
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

const categoryConfig = [
  { name: "Technology", icon: Laptop, color: "bg-blue-500" },
  { name: "Healthcare", icon: Stethoscope, color: "bg-red-500" },
  { name: "Finance", icon: TrendingUp, color: "bg-green-500" },
  { name: "Engineering", icon: Wrench, color: "bg-orange-500" },
  { name: "Education", icon: GraduationCap, color: "bg-purple-500" },
  { name: "Sales & Marketing", icon: Megaphone, color: "bg-pink-500" },
  { name: "Design", icon: Palette, color: "bg-indigo-500" },
  { name: "Retail", icon: ShoppingBag, color: "bg-yellow-500" },
  { name: "Business", icon: Building2, color: "bg-cyan-500" },
  { name: "Legal", icon: Scale, color: "bg-gray-500" },
  { name: "Customer Service", icon: Heart, color: "bg-rose-500" },
  { name: "Other", icon: Briefcase, color: "bg-slate-500" },
]

export async function JobCategories() {
  // Fetch real counts from database
  const categoryCounts = await Promise.all(
    categoryConfig.map(async (cat) => {
      const count = await prisma.job.count({
        where: {
          status: "approved",
          category: cat.name,
        },
      })
      return { ...cat, count }
    })
  )

  // Filter out categories with 0 jobs
  const categories = categoryCounts.filter(cat => cat.count > 0)
  
  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Browse Jobs by Category
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore thousands of job opportunities across various industries
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.name}
              href={`/?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <Card className="hover-lift rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${category.color} p-5 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors text-lg">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        {category.count} {category.count === 1 ? 'job' : 'jobs'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
