import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Driver, Vehicle } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';

interface Props {
  driver: Driver;
  vehicle: Vehicle;
  compact?: boolean;
}

export function DriverCard({ driver, vehicle, compact }: Props) {
  const { colors } = useTheme();

  return (
    <Card padding="base" bordered>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: colors.primary,
          }}
        >
          {driver.photoUrl ? (
            <Image source={{ uri: driver.photoUrl }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surfaceMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={28} color={colors.textTertiary} />
            </View>
          )}
        </View>

        <View style={{ flex: 1, marginLeft: spacing.base }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="h4" style={{ flex: 1 }}>{driver.fullName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text variant="bodySm" style={{ marginLeft: 4, fontWeight: '700' }}>
                {driver.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <Text variant="bodySm" color="textSecondary" style={{ marginTop: 2 }}>
            {driver.totalTrips} verified trips
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
            <Badge
              tone="success"
              size="sm"
              label="NIN verified"
              icon={<Ionicons name="checkmark-circle" size={12} color={colors.success} />}
            />
            {driver.backgroundCheckStatus === 'verified' && (
              <Badge
                tone="primary"
                size="sm"
                label="Background OK"
              />
            )}
          </View>
        </View>
      </View>

      {!compact && (
        <>
          <Divider style={{ marginVertical: spacing.base }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MetaCol label="Vehicle" value={`${vehicle.brand} ${vehicle.model}`} />
            <MetaCol label="Color" value={vehicle.color} />
            <MetaCol label="Year" value={String(vehicle.year)} />
          </View>
          <View
            style={{
              marginTop: spacing.base,
              borderRadius: radius.md,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.primary,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: colors.primaryMuted,
            }}
          >
            <Text variant="overline" color="primary">Plate Number</Text>
            <Text variant="h2" style={{ marginTop: 4, letterSpacing: 2 }}>
              {vehicle.plateNumber}
            </Text>
          </View>
        </>
      )}
    </Card>
  );
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="caption" color="textTertiary">{label}</Text>
      <Text variant="body" style={{ marginTop: 2, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}
