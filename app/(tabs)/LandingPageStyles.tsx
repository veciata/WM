import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  languageText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  iconButton: {
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 5000,
    backgroundColor: "#daba71",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "fff",
  },
  logoText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#3d6a70",
  },
  title: {
    fontSize: 18,
    color: "#daba71",
    fontWeight: "bold",
    marginTop: 10,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#000",
  },
  balanceAmount: {
    fontSize: 42,
    color: "#daba71",
    fontWeight: "bold",
  },
  balanceSub: {
    fontSize: 12,
    color: "#000",
    marginBottom: 5,
  },
  subBalance: {
    fontSize: 14,
    color: "#000",
  },
  miningButton: {
    backgroundColor: "green",
    color: "#daba71",
    paddingVertical: 10,
    marginVertical: 10,
  },
  transactionRed: {
    backgroundColor: "#D4A017",
    color: "#000",
    paddingVertical: 10,
    marginVertical: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default styles;
