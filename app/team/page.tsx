import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeamOverview } from "@/lib/team";
import TeamMemberCard from "@/components/team/TeamMemberCard";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MANAGER") {
    redirect("/");
  }

  const team = await getTeamOverview();

  return (

    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Team Members
        </h1>
        <p className="text-gray-600">
          Overview of team members and their workload
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* 4. Empty State (Opțional, dacă nu sunt membrii) */}
      {team.length === 0 && (
        <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No team members found.</p>
        </div>
      )}
    </>
  );
}
