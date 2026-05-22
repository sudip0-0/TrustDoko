"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ownerBusinessTypes } from "@/lib/business/owner-editable-fields";
import { formatBusinessType } from "@/lib/business/display";
import {
  updateBusinessProfileAction,
  type BusinessProfileActionState,
} from "@/server/actions/business-profile";
import type { BusinessForOwnerEdit } from "@/server/queries/business-owner";

const initialState: BusinessProfileActionState = {};

type BusinessProfileEditFormProps = {
  business: BusinessForOwnerEdit;
};

export function BusinessProfileEditForm({ business }: BusinessProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateBusinessProfileAction,
    initialState,
  );

  return (
    <Card>
      <CardContent className="py-6">
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <p className="text-muted mt-1 text-sm">
          Update contact and description fields. Name and trust scores cannot be
          changed here.
        </p>

        {state.message ? (
          <Alert variant="success" className="mt-4">
            {state.message}
          </Alert>
        ) : null}
        {state.error ? (
          <Alert variant="error" className="mt-4">
            {state.error}
          </Alert>
        ) : null}

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="businessId" value={business.id} />

          <div>
            <label htmlFor="description" className="text-foreground block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={business.description ?? ""}
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="text-foreground block text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                defaultValue={business.phone ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-foreground block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={business.email ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="websiteUrl" className="text-foreground block text-sm font-medium">
              Website
            </label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              defaultValue={business.websiteUrl ?? ""}
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="facebookUrl" className="text-foreground block text-sm font-medium">
                Facebook
              </label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={business.facebookUrl ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="instagramUrl" className="text-foreground block text-sm font-medium">
                Instagram
              </label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={business.instagramUrl ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="tiktokUrl" className="text-foreground block text-sm font-medium">
                TikTok
              </label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={business.tiktokUrl ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="text-foreground block text-sm font-medium">
                City
              </label>
              <Input
                id="city"
                name="city"
                defaultValue={business.city ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="province" className="text-foreground block text-sm font-medium">
                Province
              </label>
              <Input
                id="province"
                name="province"
                defaultValue={business.province ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="text-foreground block text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              name="address"
              defaultValue={business.address ?? ""}
              className="mt-1.5"
            />
          </div>

          <div>
            <label htmlFor="businessType" className="text-foreground block text-sm font-medium">
              Business type
            </label>
            <Select
              id="businessType"
              name="businessType"
              defaultValue={business.businessType}
              className="mt-1.5"
            >
              {ownerBusinessTypes.map((type) => (
                <option key={type} value={type}>
                  {formatBusinessType(type)}
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
