import { Image, Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors } from '../theme';

interface SchoolLogoProps {
  size?: number;
  uri?: string;
  source?: ImageSourcePropType;
}

export function SchoolLogo({ size = 28, uri, source }: SchoolLogoProps) {
  const imageSource: ImageSourcePropType | null = source || (uri ? { uri } : null);

  return (
    <View style={[styles.container, { width: size, height: size }]}> 
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => console.log('SchoolLogo: image loaded', imageSource)}
          onError={(e) => console.warn('SchoolLogo: image failed to load', e.nativeEvent)}
        />
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
    backgroundColor: colors.border,
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
    backgroundColor: colors.border,
  },
  fallbackText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 10,
  },
});
