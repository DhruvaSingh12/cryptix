"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold">Monocera</CardTitle>
                    <CardDescription>
                        Cryptocurrency exploration, analysis, and portfolio management
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full"
                        size="lg"
                        variant="outline"
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Continue with Google
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
