import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setFeaturedServices(data.slice(0, 4)); // Show first 4 as featured
    } catch (error) {
      console.error('Error fetching featured services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AP SALOON</Text>
        <Text style={styles.tagline}>Luxury Hair & Beauty</Text>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x200/f8f8f8/d4af37?text=Welcome+to+AP+Saloon' }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Experience Luxury</Text>
          <Text style={styles.bannerSubtitle}>Premium salon services for the modern you</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('Book')}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>180+</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4000+</Text>
          <Text style={styles.statLabel}>Artists</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Decades</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15+</Text>
          <Text style={styles.statLabel}>Awards</Text>
        </View>
      </View>

      {/* Featured Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#d4af37" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredServices.map((service) => (
              <TouchableOpacity 
                key={service._id} 
                style={styles.serviceCard}
                onPress={() => navigation.navigate('Services')}
              >
                <Image source={{ uri: 'https://via.placeholder.com/150x100/d4af37/ffffff?text=' + encodeURIComponent(service.name) }} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>₹{service.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About AP Saloon</Text>
        <Text style={styles.aboutText}>
          Inspired by the excellence of Geetanjali Salon, AP Saloon brings you world-class 
          hair and beauty services with over three decades of experience. Our expert stylists 
          and premium products ensure you get the perfect look every time.
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={styles.actionButtonText}>View Services</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.actionButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    fontFamily: 'serif',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  heroBanner: {
    position: 'relative',
    height: 250,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'serif',
  },
  serviceCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
    paddingBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
  },
  actionButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
