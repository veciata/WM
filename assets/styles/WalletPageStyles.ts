import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: "#324D4C",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  walletAddressContainer: {
    marginBottom: 16,
  },
  walletAddressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletAddress: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#324D4C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#888",
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  seeMoreButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#324D4C",
    borderRadius: 8,
    alignItems: "center",
  },
  seeMoreText: {
    color: "#fff",
    fontSize: 16,
  },
});
