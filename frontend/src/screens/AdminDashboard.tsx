import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

const AdminDashboard = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('bookings');

  // Mock data for bookings
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'Priya Sharma',
      service: 'Hair Cut & Styling',
      date: '2024-01-15',
      time: '10:00 AM',
      stylist: 'Anjali Patel',
      status: 'confirmed',
      phone: '+91 98765 43210',
      price: '₹1,500',
    },
    {
      id: 2,
      customerName: 'Meera Singh',
      service: 'Bridal Package',
      date: '2024-01-16',
      time: '2:00 PM',
      stylist: 'Kavya Reddy',
      status: 'pending',
      phone: '+91 98765 43211',
      price: '₹8,000',
    },
    {
      id: 3,
      customerName: 'Anjali Gupta',
      service: 'Hair Coloring',
      date: '2024-01-17',
      time: '11:00 AM',
      stylist: 'Priya Sharma',
      status: 'completed',
      phone: '+91 98765 43212',
      price: '₹3,500',
    },
    {
      id: 4,
      customerName: 'Riya Patel',
      service: 'Spa Treatment',
      date: '2024-01-18',
      time: '3:00 PM',
      stylist: 'Meera Singh',
      status: 'confirmed',
      phone: '+91 98765 43213',
      price: '₹2,500',
    },
  ]);

  // Mock data for services
  const [services, setServices] = useState([
    { id: 1, name: 'Hair Cut & Styling', price: '₹1,500', duration: '45 min', category: 'Hair' },
    { id: 2, name: 'Hair Coloring', price: '₹3,500', duration: '120 min', category: 'Color' },
    { id: 3, name: 'Bridal Package', price: '₹8,000', duration: '180 min', category: 'Bridal' },
    { id: 4, name: 'Spa Treatment', price: '₹2,500', duration: '90 min', category: 'Spa' },
  ]);

  const stats = {
    totalBookings: bookings.length,
    todayBookings: bookings.filter(b => b.date === '2024-01-15').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseInt(b.price.replace('₹', '').replace(',', '')), 0),
  };

  const updateBookingStatus = (bookingId: number, newStatus: string) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    Alert.alert('Success', `Booking status updated to ${newStatus}`);
  };

  const renderBookingItem = ({ item }: any) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <View style={[
          styles.statusBadge, 
          item.status === 'pending' && styles.statusPending,
          item.status === 'confirmed' && styles.statusConfirmed,
          item.status === 'completed' && styles.statusCompleted,
          item.status === 'cancelled' && styles.statusCancelled,
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.serviceText}>{item.service}</Text>
      <Text style={styles.bookingDetails}>📅 {item.date} at {item.time}</Text>
      <Text style={styles.bookingDetails}>👩‍💼 {item.stylist}</Text>
      <Text style={styles.bookingDetails}>📞 {item.phone}</Text>
      <Text style={styles.priceText}>{item.price}</Text>
      
      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => updateBookingStatus(item.id, 'confirmed')}
            >
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => updateBookingStatus(item.id, 'cancelled')}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => updateBookingStatus(item.id, 'completed')}
          >
            <Text style={styles.actionButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderServiceItem = ({ item }: any) => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceCategory}>{item.category}</Text>
      <Text style={styles.serviceDuration}>{item.duration}</Text>
      <Text style={styles.servicePrice}>{item.price}</Text>
      
      <View style={styles.serviceActions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalBookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.todayBookings}</Text>
          <Text style={styles.statLabel}>Today's Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingBookings}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹{stats.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'bookings' && styles.activeTab]}
          onPress={() => setSelectedTab('bookings')}
        >
          <Text style={[styles.tabText, selectedTab === 'bookings' && styles.activeTabText]}>
            Bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
          onPress={() => setSelectedTab('services')}
        >
          <Text style={[styles.tabText, selectedTab === 'services' && styles.activeTabText]}>
            Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedTab === 'bookings' && (
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}

        {selectedTab === 'services' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add New Service</Text>
            </TouchableOpacity>
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {selectedTab === 'analytics' && (
          <ScrollView style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Popular Services</Text>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Hair Cut & Styling</Text>
                <Text style={styles.analyticsValue}>45%</Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Hair Coloring</Text>
                <Text style={styles.analyticsValue}>30%</Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Bridal Package</Text>
                <Text style={styles.analyticsValue}>15%</Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Spa Treatment</Text>
                <Text style={styles.analyticsValue}>10%</Text>
              </View>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Monthly Revenue</Text>
              <Text style={styles.revenueAmount}>₹2,45,000</Text>
              <Text style={styles.revenueGrowth}>+15% from last month</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Customer Satisfaction</Text>
              <Text style={styles.satisfactionScore}>4.8/5</Text>
              <Text style={styles.satisfactionText}>Based on 127 reviews</Text>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#d4af37',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  statusConfirmed: {
    backgroundColor: '#d1ecf1',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceText: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookingDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 0.45,
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  completeButton: {
    backgroundColor: '#d4af37',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#d4af37',
    marginBottom: 5,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 0.45,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 0.45,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analyticsContainer: {
    flex: 1,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  analyticsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analyticsLabel: {
    fontSize: 16,
    color: '#666',
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
  },
  revenueGrowth: {
    fontSize: 14,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 5,
  },
  satisfactionScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    textAlign: 'center',
  },
  satisfactionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AdminDashboard;
