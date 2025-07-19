import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  try {
    // Check if user is already onboarded
    const result = await getUserOnboardingStatus();

    // Safety check for the result structure
    if (result && result.isOnboarded === true) {
      // Calling redirect() will throw an error, which is expected.
      redirect("/dashboard");
    }

    // If we reach here, the user needs to complete onboarding
    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    // If the error is a redirect error, we need to re-throw it
    // so Next.js can handle it and redirect the user.
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Error in onboarding page:", error);

    // Render a fallback UI for any other errors
    return (
      <main className="p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">We encountered an issue loading your profile.</p>
          <a href="/" className="text-blue-500 hover:underline">
            Return to Home
          </a>
        </div>
      </main>
    );
  }
}