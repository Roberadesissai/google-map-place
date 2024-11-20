'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Bell, Shield, Globe, MapPin, Star, Palette,
  Mail, Moon, Sun, Smartphone, Volume2, Edit,
  Save, RotateCcw, Laptop
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const defaultSettings = {
  notifications: {
    email: true,
    push: true,
    marketing: false,
    newRestaurants: true,
    specialOffers: true
  },
  privacy: {
    shareLocation: true,
    shareHistory: false,
    shareReviews: true
  },
  preferences: {
    theme: 'system',
    language: 'en',
    currency: 'USD',
    radius: 5,
    defaultRating: 4
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    soundEffects: true
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch user settings
  useEffect(() => {
    if (!user) return
    
    const fetchSettings = async () => {
      if (!user) return
      
      try {
        const docRef = doc(db, 'userSettings', user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const userSettings = docSnap.data()
          setSettings(userSettings)
          // Apply theme from settings
          setTheme(userSettings.preferences.theme)
        } else {
          // For new users, create default settings
          const newSettings = {
            ...defaultSettings,
            userId: user.uid, // Add user ID to document
            createdAt: new Date(),
            updatedAt: new Date()
          }
          await setDoc(docRef, newSettings)
          setSettings(newSettings)
          setTheme(newSettings.preferences.theme)
        }
      } catch (error) {
        console.error('Settings fetch error:', error)
        // Use default settings if fetch fails
        setSettings(defaultSettings)
        setTheme(defaultSettings.preferences.theme)
      }
    }

    fetchSettings()
  }, [user, setTheme])

  // Save settings
  const saveSettings = async () => {
    if (!user) return
    
    try {
      setSaving(true)
      const docRef = doc(db, 'userSettings', user.uid)
      
      // Create a clean copy of settings
      const settingsToSave = {
        ...settings,
        updatedAt: new Date()
      }
      
      await setDoc(docRef, settingsToSave)

      // Apply theme immediately after saving
      if (settings.preferences.theme) {
        setTheme(settings.preferences.theme)
      }
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully"
      })
      
      setHasChanges(false)
    } catch (error) {
      console.error('Save error:', error)
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "Failed to save your settings. Please try again."
      })
    } finally {
      setSaving(false)
    }
  }

  // Reset settings
  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const updateSetting = (category, key, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }
      return newSettings
    })
    
    setHasChanges(true)
  }

  const handleLanguageChange = (value) => {
    updateSetting('preferences', 'language', value)
    // Add your language change logic here
    // For example, if using i18n:
    // i18n.changeLanguage(value)
  }

  // Add this useEffect to debug settings changes
  useEffect(() => {
    console.log('Settings updated:', settings)
  }, [settings])

  return (
    <div className="container max-w-4xl p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your preferences and account settings</p>
        </motion.div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!hasChanges || saving}
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            disabled={!hasChanges || saving}
            onClick={saveSettings}
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Save className="w-4 h-4" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Star className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-2">
            <Smartphone className="w-4 h-4" />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you want to be notified about restaurant updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => 
                    updateSetting('notifications', 'email', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive push notifications on your device
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => 
                    updateSetting('notifications', 'push', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-gray-500">
                    Receive marketing and promotional emails
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => 
                    updateSetting('notifications', 'marketing', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New Restaurant Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified about new restaurants in your area
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.newRestaurants}
                  onCheckedChange={(checked) => 
                    updateSetting('notifications', 'newRestaurants', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Special Offers</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about special offers and discounts
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.specialOffers}
                  onCheckedChange={(checked) => 
                    updateSetting('notifications', 'specialOffers', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Share Location</Label>
                  <p className="text-sm text-gray-500">
                    Allow app to access your location for better recommendations
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareLocation}
                  onCheckedChange={(checked) => 
                    updateSetting('privacy', 'shareLocation', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Share Visit History</Label>
                  <p className="text-sm text-gray-500">
                    Let others see your restaurant visit history
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareHistory}
                  onCheckedChange={(checked) => 
                    updateSetting('privacy', 'shareHistory', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Share Reviews</Label>
                  <p className="text-sm text-gray-500">
                    Make your restaurant reviews public
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareReviews}
                  onCheckedChange={(checked) => 
                    updateSetting('privacy', 'shareReviews', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) => {
                    updateSetting('preferences', 'theme', value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={settings.preferences.currency}
                  onValueChange={(value) => {
                    updateSetting('preferences', 'currency', value)
                    // Trigger immediate currency format update if needed
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search Radius (km)</Label>
                <Select
                  value={String(settings.preferences.radius)}
                  onValueChange={(value) => {
                    const radius = parseInt(value, 10)
                    updateSetting('preferences', 'radius', radius)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 5, 10, 20].map((radius) => (
                      <SelectItem key={radius} value={String(radius)}>
                        {radius} km
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Rating Filter</Label>
                <Select
                  value={String(settings.preferences.defaultRating)}
                  onValueChange={(value) => {
                    const rating = parseInt(value, 10)
                    updateSetting('preferences', 'defaultRating', rating)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={String(rating)}>
                        {rating}+ Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                Customize your accessibility preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-gray-500">
                    Minimize animations throughout the app
                  </p>
                </div>
                <Switch
                  checked={settings.accessibility.reducedMotion}
                  onCheckedChange={(checked) => 
                    updateSetting('accessibility', 'reducedMotion', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete Account Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Permanent account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      try {
                        // Add your delete account logic here
                        toast({
                          title: "Account deleted",
                          description: "Your account has been permanently deleted"
                        })
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to delete account"
                        })
                      }
                    }}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </Tabs>
      <Toaster />
    </div>
  )
}