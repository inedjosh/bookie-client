import { useState } from "react";
import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GoalOverviewType } from "../../../../../types";
import CompletedGoalCard from "../../../../../components/CompletedGoalCard";
import PointsEarnedGoalCard from "../../../../../components/PointsEarnedGoalCard";
import { Dart } from "../../../../../assets";

type Props = { goals: GoalOverviewType };

function MiniClassOverviewCard({ goals }: Props) {
  const [activeSection, setActiveSection] = useState<string | null>("weekly");

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <Card className="w-full " variant="outlined">
      <Typography as="h3" variant="subheading2">
        Goals
      </Typography>
      <div className="flex justify-center flex-col mt-5 items-center">
        <img src={Dart} className="w-20" />

        <div className="w-full">
          {/* Weekly Goals */}
          <div className="w-full">
            <div
              className="bg-[#F7F7F7] w-full flex rounded-[8px] justify-between items-center py-4 px-2 mt-5 cursor-pointer"
              onClick={() => toggleSection("weekly")}
            >
              <Typography variant="body" className="" color="blackText">
                Weekly goals:
              </Typography>
              {activeSection === "weekly" ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {activeSection === "weekly" && (
              <div className="w-full justify-between py-3 flex">
                <CompletedGoalCard
                  point={goals.miniClassTotalCount.weekly ?? 0}
                  total={goals.total.miniClass.week}
                />
                <PointsEarnedGoalCard
                  point={goals.weeklyPoints.miniClass.totalPoints}
                  total={goals.total.miniClass.week * 10}
                />
              </div>
            )}
          </div>

          {/* Monthly Goals */}
          <div className="w-full">
            <div
              className="bg-[#F7F7F7] w-full flex rounded-[8px] justify-between items-center py-4 px-2 mt-5 cursor-pointer"
              onClick={() => toggleSection("monthly")}
            >
              <Typography variant="body" className="" color="blackText">
                Monthly goals:
              </Typography>
              {activeSection === "monthly" ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {activeSection === "monthly" && (
              <div className="w-full justify-between py-3 flex">
                <CompletedGoalCard
                  point={goals.miniClassTotalCount.monthly ?? 0}
                  total={goals.total.miniClass.month}
                />
                <PointsEarnedGoalCard
                  point={goals.monthlyPoints.miniClass.totalPoints}
                  total={goals.total.miniClass.month * 10}
                />
              </div>
            )}
          </div>

          {/* Course Goals */}
          <div className="w-full">
            <div
              className="bg-[#F7F7F7] w-full flex rounded-[8px] justify-between items-center py-4 px-2 mt-5 cursor-pointer"
              onClick={() => toggleSection("course")}
            >
              <Typography variant="body" className="" color="blackText">
                Course goals:
              </Typography>
              {activeSection === "course" ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {activeSection === "course" && (
              <div className="w-full justify-between py-3 flex">
                <CompletedGoalCard
                  point={goals.miniClassTotalCount.overall ?? 0}
                  total={goals.total.miniClass.course}
                />
                <PointsEarnedGoalCard
                  point={goals.coursePoints.miniClass.totalPoints}
                  total={goals.total.miniClass.course * 10}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MiniClassOverviewCard;
