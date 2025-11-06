import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const BUTTONS = [
  ["1", "2", "3", "/"],
  ["4", "5", "6", "-"],
  ["7", "8", "9", "X"],
  [".", "0", "%", "÷"],
];

export default function Calculator() {
  const [display, setDisplay] = useState("");

  const isOperatorChar = (ch) => ["/", "-", "X", "÷", "+", "*"].includes(ch);

  const appendToDisplay = (val) => {
    setDisplay((prev) => {
      if (prev === "0" && /[0-9]/.test(val)) return val;
      return prev + val;
    });
  };

  const handleNumber = (label) => appendToDisplay(label);

  const handleDot = () => {
    const match = display.match(/(\d+\.?\d*)$/);
    if (match && match[0].includes(".")) return;
    if (!match) setDisplay((p) => (p === "" ? "0." : p + "0."));
    else setDisplay((p) => p + ".");
  };

  const handleOperator = (label) => {
    setDisplay((prev) => {
      if (prev === "" && label === "-") return "-";
      if (prev === "") return prev;
      if (isOperatorChar(prev.slice(-1))) return prev.slice(0, -1) + label;
      return prev + label;
    });
  };

  const handlePercent = () => {
    setDisplay((prev) => {
      const m = prev.match(/(\d+\.?\d*)$/);
      if (!m) return prev;
      const num = parseFloat(m[0]);
      const replaced = (num / 100).toString();
      return prev.slice(0, m.index) + replaced;
    });
  };

  const handleDelete = () =>
    setDisplay((prev) => (prev.length > 0 ? prev.slice(0, -1) : ""));

  const handleAnswer = () => {
    if (!display) return;
    let expr = display.replace(/X/g, "*").replace(/÷/g, "/");
    if (isOperatorChar(expr.slice(-1))) expr = expr.slice(0, -1);
    try {
      const result = Function("return " + expr)();
      const displayResult =
        typeof result === "number" && !Number.isInteger(result)
          ? String(Number(result.toFixed(10)))
          : String(result);
      setDisplay(displayResult);
    } catch (_e) {
      setDisplay("Error");
      setTimeout(() => setDisplay(""), 900);
    }
  };

  const onPress = (label) => {
    if (label === "Delete") return handleDelete();
    if (label === "Answer") return handleAnswer();
    if (label === ".") return handleDot();
    if (label === "%") return handlePercent();
    if (["/", "-", "X", "÷", "+", "*"].includes(label))
      return handleOperator(label);
    return handleNumber(label);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calculator</Text>
      </View>

      <View style={styles.display}>
        <Text numberOfLines={1} style={styles.displayText}>
          {display || "0"}
        </Text>
      </View>

      <View style={styles.topButtonsRow}>
        <Pressable
          style={[styles.topButton, styles.deleteButton]}
          onPress={() => onPress("Delete")}
        >
          <Text style={styles.topButtonText}>Delete</Text>
        </Pressable>
        <Pressable
          style={[styles.topButton, styles.answerButton]}
          onPress={() => onPress("Answer")}
        >
          <Text style={styles.topButtonText}>Answer</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {BUTTONS.map((row, rIdx) => (
          <View style={styles.row} key={rIdx}>
            {row.map((label, cIdx) => {
              const isOperator = ["/", "-", "X", "÷", "+", "*", "%"].includes(
                label
              );
              return (
                <Pressable
                  key={cIdx}
                  style={[
                    styles.button,
                    isOperator ? styles.operatorButton : styles.numberButton,
                  ]}
                  onPress={() => onPress(label)}
                >
                  <Text style={styles.buttonText}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#00C4AD",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  display: {
    height: 220,
    backgroundColor: "#fff",
  },
  topButtonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
  },
  topButton: {
    flex: 1,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#0da0d9",
  },
  answerButton: {
    backgroundColor: "#0da0d9",
  },
  topButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  grid: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 5,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    backgroundColor: "#016bb3",
  },
  operatorButton: {
    backgroundColor: "#4fd6c6",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  displayText: {
    color: "#000",
    fontSize: 36,
    fontWeight: "600",
    textAlign: "right",
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
});
