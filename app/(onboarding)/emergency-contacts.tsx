import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { riderService } from '@/services/rider.service';
import { EmergencyContact } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function EmergencyContactsOnboarding() {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    riderService.getEmergencyContacts().then(setContacts);
  }, []);

  const add = async () => {
    setError(null);
    if (!name.trim() || phone.replace(/\D/g, '').length < 10 || !relationship.trim()) {
      setError('Fill in name, phone and relationship');
      return;
    }
    setSaving(true);
    try {
      const c = await riderService.addEmergencyContact({
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim(),
        priority: contacts.length + 1,
      });
      setContacts((cur) => [...cur, c]);
      setName(''); setPhone(''); setRelationship('');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await riderService.removeEmergencyContact(id);
    setContacts((cur) => cur.filter((c) => c.id !== id));
  };

  const proceed = () => router.replace('/(rider)/(tabs)');

  return (
    <Screen scroll>
      <Header />
      <Text variant="displaySm">Who should we{'\n'}notify?</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
        Add up to 5 loved ones. If you trigger SOS during a ride, they'll instantly receive your live location and driver details.
      </Text>

      <View style={{ marginBottom: spacing.lg }}>
        {contacts.map((c, i) => (
          <MotiView
            key={c.id}
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={i * 60}
            style={{ marginBottom: spacing.sm }}
          >
            <Card padding="md" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: colors.primaryMuted,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text variant="h4" color="primary">{c.name[0]}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text variant="body" style={{ fontWeight: '600' }}>{c.name}</Text>
                <Text variant="bodySm" color="textSecondary">{c.phone} · {c.relationship}</Text>
              </View>
              <Pressable onPress={() => remove(c.id)} hitSlop={10}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </Card>
          </MotiView>
        ))}
      </View>

      {contacts.length < 5 && (
        <Card padding="base" bordered elevated={false} style={{ marginBottom: spacing.base }}>
          <Text variant="h4" style={{ marginBottom: spacing.md }}>Add contact</Text>
          <Input placeholder="Full name" value={name} onChangeText={setName} />
          <Input placeholder="Phone (+234...)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input placeholder="Relationship (e.g. Mum, Brother)" value={relationship} onChangeText={setRelationship} />
          {error ? <Text variant="bodySm" color="danger" style={{ marginBottom: 8 }}>{error}</Text> : null}
          <Button label="Add contact" variant="outline" onPress={add} loading={saving} />
        </Card>
      )}

      <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
        <Button label={contacts.length > 0 ? 'Continue' : 'Skip for now'} onPress={proceed} />
        {contacts.length === 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: spacing.md,
              borderRadius: radius.md,
              backgroundColor: colors.warningMuted,
              gap: 8,
            }}
          >
            <Ionicons name="warning-outline" size={16} color={colors.warning} style={{ marginTop: 2 }} />
            <Text variant="bodySm" color="textSecondary" style={{ flex: 1 }}>
              We strongly recommend adding at least one contact. SOS still notifies authorities either way.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}
