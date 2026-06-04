import { Image, Text, View, StyleSheet, ImageSourcePropType } from 'react-native';

interface SchoolLogoProps {
  size?: number;
  uri?: string;
  source?: ImageSourcePropType;
}

export function SchoolLogo({ size = 28, uri, source }: SchoolLogoProps) {
  const imageSource: ImageSourcePropType | null = source || (uri ? { uri } : null);
      ) : (
        <View style={[styles.fallback, { width: size, height: size }]}> 
          <Text style={styles.fallbackText}>Logo</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBD5E1',
  },
  fallbackText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 10,
  },
});
