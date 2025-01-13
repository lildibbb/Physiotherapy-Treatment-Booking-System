"use client";

import * as React from "react";
import { Hammer, Construction, ArrowRight, Home, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function UnderConstruction() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  p-4">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Animation container */}
        <div className="mb-8 flex justify-center space-x-6">
          <Hammer className="h-12 w-12 animate-bounce text-yellow-500 dark:text-yellow-400" />
          <Construction className="h-12 w-12 animate-pulse text-orange-500 dark:text-orange-400" />
          <Hammer className="h-12 w-12 animate-bounce text-red-500 dark:text-red-400" />
        </div>

        <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          Under Construction
        </h1>

        <p className="mb-8 text-xl text-muted-foreground">
          We're working hard to bring you something amazing. Our new website is
          currently under construction and will be ready soon.
        </p>

        <Card className="mb-8 border-border/40 bg-card/50 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Expected Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-left">
              {[
                "Modern User Interface",
                "Enhanced User Experience",
                "Improved Performance",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="font-medium">{feature}</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-secondary/50 hover:bg-secondary"
                  >
                    Coming Soon
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              asChild
              size="lg"
              variant="default"
              className="w-full sm:w-auto"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link to="/">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="animate-pulse border-primary/20">
            Launch Date
          </Badge>
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
