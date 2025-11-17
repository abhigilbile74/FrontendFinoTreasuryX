import React, { useState, useEffect } from "react";
import RuPaySymbol from './ui/RuPaySymbol';

export default function GoalTracker() {
  const [goalName, setGoalName] = useState("Emergency Fund Build");
  const [goalAmount, setGoalAmount] = useState(6000);
  const [timeline, setTimeline] = useState(12);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [strategies, setStrategies] = useState({
    s1: 200,
    s2: 100,
    s3: 200,
  });
  const [totalSaved, setTotalSaved] = useState(0);
  const [goalStatement, setGoalStatement] = useState("");
  const [progress, setProgress] = useState({
    percent: 0,
    saved: 0,
    remaining: 0,
    message: "",
  });

  // Update goal statement dynamically
  useEffect(() => {
    if (goalAmount > 0 && monthlyContribution > 0 && timeline > 0) {
      setGoalStatement(
        `Set to achieve **$${goalName}** requiring **$${goalAmount.toLocaleString(
          "en-US"
        )}** by contributing **$${monthlyContribution.toLocaleString(
          "en-US"
        )}** every month over **$${timeline}** months.`
      );
    } else {
      setGoalStatement(
        `Please enter valid values for the Goal Amount, Monthly Contribution, and Timeline.`
      );
    }
  }, [goalName, goalAmount, monthlyContribution, timeline]);

  // Calculate total strategy contribution
  const totalStrategy =
    (parseFloat(strategies.s1) || 0) +
    (parseFloat(strategies.s2) || 0) +
    (parseFloat(strategies.s3) || 0);

  // Update progress display
  const updateProgress = () => {
    const goal = parseFloat(goalAmount) || 0;
    let saved = parseFloat(totalSaved) || 0;

    if (goal <= 0) {
      setProgress({
        ...progress,
        message: "⚠️ Please set a valid Goal Amount.",
      });
      return;
    }

    if (saved < 0) saved = 0;

    const displayedSaved = Math.min(saved, goal);
    const percent = (displayedSaved / goal) * 100;
    const remaining = goal - displayedSaved;

    let message = "";
    if (saved >= goal) {
      message = `🎉 **CONGRATULATIONS!** You’ve reached your $${goal.toLocaleString(
        "en-US"
      )} goal!`;
    } else {
      message = `Current Status: ${percent.toFixed(2)}% complete!\n\nSaved: **$${displayedSaved.toLocaleString(
        "en-US"
      )}**\nRemaining: **$${remaining.toLocaleString(
        "en-US"
      )}**\nTarget Monthly Contribution: **$${monthlyContribution.toLocaleString(
        "en-US"
      )}**`;
    }

    setProgress({ percent, saved: displayedSaved, remaining, message });
  };

  useEffect(() => {
    updateProgress();
  }, [goalAmount, totalSaved]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 my-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 border-b-4 border-blue-600 pb-3">
        🎯 My Dynamic Financial Goal Planner
      </h1>

      {/* Define Goal Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          📝 Define Your Goal
        </h2>

        <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold w-48">Goal Name:</label>
            <input
              type="text"
              className="border rounded-md px-3 py-2 w-full md:w-72"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold w-48">
              Total Goal Amount (<RuPaySymbol showLogo={false} />):
            </label>
            <input
              type="number"
              className="border rounded-md px-3 py-2 w-full md:w-72"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold w-48">Timeline (Months):</label>
            <input
              type="number"
              className="border rounded-md px-3 py-2 w-full md:w-72"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold w-48">
              Monthly Contribution (<RuPaySymbol showLogo={false} />):
            </label>
            <input
              type="number"
              className="border rounded-md px-3 py-2 w-full md:w-72"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>

          <p className="text-gray-700 font-medium mt-3">
            <strong>Goal Statement:</strong>{" "}
            <span className="text-gray-800">{goalStatement}</span>
          </p>
        </div>
      </section>

      <hr className="my-8" />

      {/* Strategy Breakdown */}
      <section>
        <h2 className="text-2xl font-semibold text-green-600 mb-3">
          ✅ Strategy Breakdown (Monthly)
        </h2>

        <table className="w-full border-collapse border border-gray-300 text-left text-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-center">
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Monthly Contribution (<RuPaySymbol showLogo={false} />)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Automated Savings Transfer", "s1"],
              ["Expense Reduction (Subscriptions/Eating Out)", "s2"],
              ["Extra Income (Freelance/Selling)", "s3"],
            ].map(([label, key]) => (
              <tr key={key} className="border">
                <td className="py-2 px-3">{label}</td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={strategies[key]}
                    onChange={(e) =>
                      setStrategies({ ...strategies, [key]: e.target.value })
                    }
                    className="border rounded-md px-2 py-1 w-32"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-blue-100 font-semibold">
              <td className="py-2 px-3">TOTAL STRATEGY CONTRIBUTION</td>
              <td className="py-2 px-3"><RuPaySymbol showLogo={false} />{totalStrategy}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr className="my-8" />

      {/* Progress Section */}
      <section className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">📈 Track Your Progress</h2>
        <p className="text-gray-700 mb-4">
          Enter the <strong>Total Amount Saved So Far</strong> against the <RuPaySymbol showLogo={false} />
          {goalAmount.toLocaleString("en-US")} goal.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <label className="font-semibold">Total Fund Saved:</label>
          <input
            type="number"
            value={totalSaved}
            onChange={(e) => setTotalSaved(e.target.value)}
            className="border rounded-md px-3 py-2 w-40"
          />
          <button
            onClick={updateProgress}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-4 py-2 rounded-md transition"
          >
            Update Status
          </button>
        </div>

        <div className="border border-dashed border-gray-500 rounded-md bg-white p-4 whitespace-pre-line">
          <strong>Status:</strong> {progress.message}
        </div>
      </section>
    </div>
  );
}
