import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-0">
      

      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-6xl sm:text-4xl font-bold text-foreground mr-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-200">
            Industry Insights
          </span>
        </h1>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
          Your personalized industry analytics
        </span>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
