"use client"

import { useState } from "react"
import { EmployerSidebar } from "@/components/employer/EmployerSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CreditCard, FileText, Info, Search } from "lucide-react"

export default function BillingPage() {
  const [startDate, setStartDate] = useState("08/14/2025")
  const [endDate, setEndDate] = useState(new Date().toLocaleDateString("en-US"))
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing</h1>
            <p className="text-muted-foreground">Manage your billing and invoices</p>
          </div>

          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="information">Information</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              {/* Alert for no payment method */}
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <strong>No valid card Payment method</strong>
                    <p className="text-sm">This account does not have a Payment method.</p>
                  </div>
                  <Button>Update billing information</Button>
                </AlertDescription>
              </Alert>

              {/* Balance Due Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <CardTitle>Balance due</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Invoices due</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Overdue Invoices</p>
                      <p className="text-3xl font-bold text-red-600">0</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Invoice total</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Total Balance due</p>
                      <p className="text-3xl font-bold">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction history</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-40"
                        />
                        <span>to</span>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-40"
                        />
                      </div>
                      <Button variant="outline">Update</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by Invoice number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="payments">Payments</TabsTrigger>
                      <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No transactions</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="payments">
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No payment transactions</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="invoices">
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No invoice transactions</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Most Recent Payment */}
              <Card>
                <CardHeader>
                  <CardTitle>Most recent payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No payments to date</p>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Payment method</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Currency</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">None</span>
                    <span className="text-muted-foreground">($) USD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="link" className="h-auto p-0">Add</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Billing threshold</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mt-1">USD 500</p>
                  </div>
                </CardContent>
              </Card>

              {/* Helpful Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Helpful links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="link" className="h-auto p-0">Performance Report</Button>
                  <br />
                  <Button variant="link" className="h-auto p-0">Billing FAQ</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="information" className="space-y-6">
              {/* Billing Contact */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Billing contact</CardTitle>
                  </div>
                  <Button variant="outline">Edit</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Name</p>
                      <p className="text-muted-foreground">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <p className="text-muted-foreground">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Company</p>
                      <p className="text-muted-foreground">-</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Fax</p>
                      <p className="text-muted-foreground">-</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium mb-1">Billing email</p>
                      <p className="text-blue-600">khennethcobyglegaspi@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Billing information</CardTitle>
                  </div>
                  <Button variant="outline">Edit</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Country</p>
                      <p className="text-muted-foreground">PH</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Currency</p>
                      <p className="text-muted-foreground">($) USD</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium mb-1">Billing address</p>
                      <p className="text-muted-foreground">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">None</span>
                    <Button variant="link" className="h-auto p-0">Add</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
