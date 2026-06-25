import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Settings" };

async function saveBusinessSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.businessSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      businessName: formData.get("businessName") as string || null,
      displayName: formData.get("displayName") as string || null,
      email: formData.get("email") as string || null,
      website: formData.get("website") as string || null,
      address: formData.get("address") as string || null,
      logoUrl: formData.get("logoUrl") as string || null,
      defaultPaymentTerms: formData.get("defaultPaymentTerms") as string || null,
      defaultRevisionPolicy: formData.get("defaultRevisionPolicy") as string || null,
      defaultPickupPolicy: formData.get("defaultPickupPolicy") as string || null,
      quotePrefix: formData.get("quotePrefix") as string || "Q",
      invoicePrefix: formData.get("invoicePrefix") as string || "INV",
    },
    update: {
      businessName: formData.get("businessName") as string || null,
      displayName: formData.get("displayName") as string || null,
      email: formData.get("email") as string || null,
      website: formData.get("website") as string || null,
      address: formData.get("address") as string || null,
      logoUrl: formData.get("logoUrl") as string || null,
      defaultPaymentTerms: formData.get("defaultPaymentTerms") as string || null,
      defaultRevisionPolicy: formData.get("defaultRevisionPolicy") as string || null,
      defaultPickupPolicy: formData.get("defaultPickupPolicy") as string || null,
      quotePrefix: formData.get("quotePrefix") as string || "Q",
      invoicePrefix: formData.get("invoicePrefix") as string || "INV",
    },
  });

  revalidatePath("/settings");
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, settings, subscription] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.businessSettings.findUnique({ where: { userId } }),
    db.subscription.findUnique({ where: { userId } }),
  ]);

  const plan = subscription?.plan || "free";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business preferences.</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="templates">
            <Link href="/settings/templates" className="block w-full">Usage Templates</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Business Profile</CardTitle></CardHeader>
            <CardContent>
              <form action={saveBusinessSettings} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" name="businessName" defaultValue={settings?.businessName || ""} placeholder="Your Voice Talent Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" name="displayName" defaultValue={settings?.displayName || user?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={settings?.email || user?.email || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" type="url" placeholder="https://" defaultValue={settings?.website || ""} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" defaultValue={settings?.address || ""} placeholder="Your business address" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input id="logoUrl" name="logoUrl" placeholder="https://..." defaultValue={settings?.logoUrl || ""} />
                    <p className="text-xs text-muted-foreground">Link to your logo image (included in PDFs)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                  <Textarea id="defaultPaymentTerms" name="defaultPaymentTerms" rows={2}
                    defaultValue={settings?.defaultPaymentTerms || "Payment due within 30 days of invoice date."} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultRevisionPolicy">Default Revision Policy</Label>
                  <Textarea id="defaultRevisionPolicy" name="defaultRevisionPolicy" rows={3}
                    defaultValue={settings?.defaultRevisionPolicy || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPickupPolicy">Default Pickup Policy</Label>
                  <Textarea id="defaultPickupPolicy" name="defaultPickupPolicy" rows={3}
                    defaultValue={settings?.defaultPickupPolicy || ""} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quotePrefix">Quote Number Prefix</Label>
                    <Input id="quotePrefix" name="quotePrefix" defaultValue={settings?.quotePrefix || "Q"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                    <Input id="invoicePrefix" name="invoicePrefix" defaultValue={settings?.invoicePrefix || "INV"} />
                  </div>
                </div>
                <Button type="submit">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Billing & Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold capitalize">{plan} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {plan === "free" && "3 clients, 3 quotes, 10 auditions"}
                    {plan === "solo" && "Unlimited clients, quotes, and auditions"}
                    {plan === "pro" && "Everything in Solo + CSV export and advanced features"}
                  </p>
                </div>
                {plan === "free" && (
                  <Button asChild><Link href="/pricing">Upgrade</Link></Button>
                )}
              </div>
              {subscription?.stripeSubscriptionId && (
                <p className="text-sm text-muted-foreground">
                  Subscription ID: {subscription.stripeSubscriptionId}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
