import { useState } from "react";
import Card from "../../../../../components/Card";
import { Typography } from "../../../../../components/Typography";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GoalOverviewType } from "../../../../../types";
import { Dart } from "../../../../../assets";
import PointsEarnedGoalCard from "../../../../../components/PointsEarnedGoalCard";
import CompletedGoalCard from "../../../../../components/CompletedGoalCard";

type Props = { goals: GoalOverviewType };
function ClassGoalCard({ goals }: Props) {
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

        <div className="w-full mt-10">
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
                  point={goals.classTotalCount.weekly ?? 0}
                  total={goals.total.class.week}
                />
                <PointsEarnedGoalCard
                  point={goals.weeklyPoints.class.totalPoints}
                  total={goals.total.class.week * 10}
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
                  point={goals.classTotalCount.monthly ?? 0}
                  total={goals.total.class.month}
                />
                <PointsEarnedGoalCard
                  point={goals.monthlyPoints.class.totalPoints}
                  total={goals.total.class.month * 10}
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
                  point={goals.classTotalCount.overall ?? 0}
                  total={goals.total.class.course}
                />
                <PointsEarnedGoalCard
                  point={goals.coursePoints.class.totalPoints}
                  total={goals.total.class.course * 10}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ClassGoalCard;
