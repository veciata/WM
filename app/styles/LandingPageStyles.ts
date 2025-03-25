import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8faf6',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 30,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceSub: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  subBalance: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  miningButton: {
    backgroundColor: '#daba71',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  transactionRed: {
    backgroundColor: '#ff4444',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
}); 