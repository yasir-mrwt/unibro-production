import {
  Users,
  Shield,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  Star,
  ThumbsUp,
  Ban,
  Flag,
  Award,
  Target,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  Mail,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import "../styles/communityPage.css";

const CommunityGuidelines = () => {
  const { darkMode } = useTheme();

  const communityStats = [
    { icon: Users, label: "Active Members", value: "5,000+", color: "blue" },
    {
      icon: MessageSquare,
      label: "Daily Posts",
      value: "500+",
      color: "purple",
    },
    { icon: Heart, label: "Helpful Answers", value: "10,000+", color: "pink" },
    { icon: Award, label: "Top Contributors", value: "200+", color: "yellow" },
  ];

  const rules = [
    {
      icon: Heart,
      title: "Be Respectful & Kind",
      description:
        "Treat everyone with respect. No harassment, hate speech, or personal attacks.",
      dos: [
        "Use polite and professional language",
        "Respect diverse opinions and backgrounds",
        "Be constructive in your criticism",
        "Help others learn and grow",
      ],
      donts: [
        "No bullying or harassment",
        "No discriminatory language",
        "No personal attacks or insults",
        "No trolling or baiting",
      ],
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Ban,
      title: "No Spam or Self-Promotion",
      description:
        "Keep the community focused on learning. No excessive self-promotion or spam.",
      dos: [
        "Share valuable educational content",
        "Contribute to discussions meaningfully",
        "Ask genuine questions",
        "Provide helpful resources when relevant",
      ],
      donts: [
        "No repeated posting of same content",
        "No unsolicited advertisements",
        "No affiliate links without disclosure",
        "No off-topic marketing",
      ],
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Respect Privacy & Safety",
      description:
        "Protect your privacy and respect others'. Never share personal information.",
      dos: [
        "Keep personal information private",
        "Report suspicious behavior",
        "Use secure passwords",
        "Think before you share",
      ],
      donts: [
        "No sharing of personal contact details",
        "No doxxing or exposing others",
        "No sharing of private messages",
        "No impersonation",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Original & Quality Content",
      description:
        "Share authentic work. Give credit where it's due and maintain quality standards.",
      dos: [
        "Create original, thoughtful content",
        "Cite sources and give credit",
        "Use proper grammar and formatting",
        "Contribute valuable information",
      ],
      donts: [
        "No plagiarism or copying",
        "No low-effort posts",
        "No misleading information",
        "No copyright violations",
      ],
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Target,
      title: "Stay On Topic",
      description:
        "Keep discussions relevant to education and learning. Use appropriate channels.",
      dos: [
        "Post in relevant categories",
        "Stay focused on the topic",
        "Use descriptive titles",
        "Search before posting duplicates",
      ],
      donts: [
        "No off-topic discussions",
        "No derailing conversations",
        "No posting in wrong channels",
        "No duplicate questions",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Flag,
      title: "Report Issues Responsibly",
      description:
        "Help us maintain a safe community by reporting violations appropriately.",
      dos: [
        "Report rule violations calmly",
        "Provide context when reporting",
        "Trust the moderation team",
        "Suggest improvements constructively",
      ],
      donts: [
        "No false reporting",
        "No public call-outs",
        "No vigilante moderation",
        "No harassment of reported users",
      ],
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const consequences = [
    {
      severity: "Minor Violation",
      icon: AlertTriangle,
      color: "yellow",
      actions: ["Friendly warning", "Content removal", "Educational resources"],
    },
    {
      severity: "Moderate Violation",
      icon: XCircle,
      color: "orange",
      actions: [
        "Formal warning",
        "Temporary suspension (1-7 days)",
        "Required review of guidelines",
      ],
    },
    {
      severity: "Major Violation",
      icon: Ban,
      color: "red",
      actions: [
        "Permanent ban",
        "Account termination",
        "Possible legal action",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-40 right-1/4 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 sm:pb-20">
        {/* 🎯 HERO SECTION */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Build Together, Learn Together
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight animate-fade-in-up">
            <span className={darkMode ? "text-white" : "text-gray-900"}>
              Unibro{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Community
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands of students, educators, and learners in a safe,
            respectful, and inspiring space where knowledge thrives and
            connections grow.
          </p>

          {/* Community Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-12">
            {communityStats.map((stat, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl ${
                  darkMode
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-lg"
                } hover:scale-105 transition-all duration-300 animate-fade-in-up cursor-pointer`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity ${
                    stat.color === "blue"
                      ? "from-blue-600/5 to-cyan-600/5"
                      : stat.color === "purple"
                      ? "from-purple-600/5 to-pink-600/5"
                      : stat.color === "pink"
                      ? "from-pink-600/5 to-rose-600/5"
                      : "from-yellow-600/5 to-orange-600/5"
                  }`}
                ></div>
                <stat.icon
                  className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                    stat.color === "blue"
                      ? "text-blue-500"
                      : stat.color === "purple"
                      ? "text-purple-500"
                      : stat.color === "pink"
                      ? "text-pink-500"
                      : "text-yellow-500"
                  }`}
                />
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mt-1`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 WHY GUIDELINES MATTER */}
        <div
          className={`max-w-4xl mx-auto mb-20 p-8 sm:p-12 rounded-3xl animate-fade-in-up ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
              : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
          }`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div
              className={`p-4 rounded-2xl ${
                darkMode ? "bg-blue-500/10" : "bg-blue-100"
              } animate-bounce-slow`}
            >
              <Target
                className={`w-8 h-8 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Why Community Guidelines Matter
              </h2>
              <p
                className={`text-lg leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Our community guidelines ensure that Unibro remains a{" "}
                <span className="font-semibold text-blue-600">
                  safe, productive, and inspiring space
                </span>{" "}
                for everyone. By following these rules, you help create an
                environment where everyone can thrive.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: Shield, text: "Everyone feels safe and respected" },
              { icon: TrendingUp, text: "Quality content rises to the top" },
              { icon: Zap, text: "Meaningful connections are formed" },
              { icon: Star, text: "Learning happens naturally" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 ${
                  darkMode
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-white/50 hover:bg-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 GOLDEN RULES SECTION */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2
              className={`text-4xl sm:text-5xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Our Golden Rules
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } max-w-2xl mx-auto`}
            >
              Six essential principles that keep our community thriving
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {rules.map((rule, index) => (
              <div
                key={index}
                className={`group relative ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-xl"
                } rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up`}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                {/* Hover Gradient Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <div className="relative p-8">
                  {/* Rule Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${rule.color} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <rule.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {rule.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  {/* DO's and DON'Ts */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* DO Section */}
                    <div
                      className={`p-4 rounded-2xl transition-all hover:scale-105 ${
                        darkMode
                          ? "bg-green-500/5 border border-green-500/20 hover:bg-green-500/10"
                          : "bg-green-50 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle
                          className={`w-5 h-5 ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <h4
                          className={`font-bold text-sm ${
                            darkMode ? "text-green-400" : "text-green-700"
                          }`}
                        >
                          DO
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {rule.dos.map((item, idx) => (
                          <li
                            key={idx}
                            className={`text-xs flex items-start gap-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* DON'T Section */}
                    <div
                      className={`p-4 rounded-2xl transition-all hover:scale-105 ${
                        darkMode
                          ? "bg-red-500/5 border border-red-500/20 hover:bg-red-500/10"
                          : "bg-red-50 border border-red-200 hover:bg-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <XCircle
                          className={`w-5 h-5 ${
                            darkMode ? "text-red-400" : "text-red-600"
                          }`}
                        />
                        <h4
                          className={`font-bold text-sm ${
                            darkMode ? "text-red-400" : "text-red-700"
                          }`}
                        >
                          DON'T
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {rule.donts.map((item, idx) => (
                          <li
                            key={idx}
                            className={`text-xs flex items-start gap-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <Ban className="w-3 h-3 mt-0.5 flex-shrink-0 text-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 CONSEQUENCES SECTION */}
        <div
          className={`max-w-5xl mx-auto mb-20 p-8 sm:p-12 rounded-3xl animate-fade-in-up ${
            darkMode
              ? "bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-800/50"
              : "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200"
          }`}
        >
          <div className="text-center mb-10">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                darkMode ? "bg-red-500/10" : "bg-red-100"
              }`}
            >
              <Shield
                className={`w-8 h-8 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Violation Consequences
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } max-w-2xl mx-auto`}
            >
              We enforce these guidelines fairly and consistently to protect our
              community
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {consequences.map((consequence, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                  darkMode
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-lg"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    consequence.color === "yellow"
                      ? "bg-yellow-500/10"
                      : consequence.color === "orange"
                      ? "bg-orange-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <consequence.icon
                    className={`w-6 h-6 ${
                      consequence.color === "yellow"
                        ? "text-yellow-500"
                        : consequence.color === "orange"
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  />
                </div>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {consequence.severity}
                </h3>
                <ul className="space-y-2">
                  {consequence.actions.map((action, idx) => (
                    <li
                      key={idx}
                      className={`text-sm flex items-start gap-2 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          consequence.color === "yellow"
                            ? "bg-yellow-500"
                            : consequence.color === "orange"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 PRIVACY & SAFETY SECTION */}
        <div
          className={`max-w-4xl mx-auto mb-20 p-8 sm:p-12 rounded-3xl animate-fade-in-up ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800/50"
              : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className={`p-4 rounded-2xl ${
                darkMode ? "bg-blue-500/10" : "bg-blue-100"
              }`}
            >
              <Lock
                className={`w-8 h-8 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Privacy & Safety First
              </h2>
              <p
                className={`text-lg leading-relaxed mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                We take your security seriously. Here's how we protect you:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Eye, text: "24/7 Content Moderation" },
                  { icon: Shield, text: "Advanced Spam Filters" },
                  { icon: Lock, text: "Encrypted Communications" },
                  { icon: Flag, text: "Easy Reporting Tools" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 ${
                      darkMode
                        ? "bg-gray-900/50 hover:bg-gray-900"
                        : "bg-white/80 hover:bg-white"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 CALL TO ACTION */}
        <div className="text-center animate-fade-in-up">
          <div
            className={`inline-block p-8 sm:p-12 rounded-3xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
            }`}
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-semibold">Join the Movement</span>
              </div>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Be Part of Something Great?
            </h2>
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              By joining Unibro, you agree to uphold these guidelines and help
              us create a community we're all proud of.
            </p>
          </div>
        </div>

        {/* 🎯 FOOTER NOTE */}
        <div
          className={`text-center mt-16 p-6 rounded-2xl ${
            darkMode
              ? "bg-gray-900/50 border border-gray-800"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            These guidelines are subject to change. Last updated: November 2025
            • Questions? Email us at{" "}
            <a
              href="mailto:yasirmarwat09@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              community@unibro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
