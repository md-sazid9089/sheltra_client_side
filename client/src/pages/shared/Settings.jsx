import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Settings() {

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Settings</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Manage your preferences
        </p>
      </div>


      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Language</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary dark:text-text-darkPrimary">
                Display Language
              </p>
              <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
                Multi-language support coming soon
              </p>
            </div>
            <Button size="sm" variant="ghost" disabled>
              English (Default)
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Account */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Account</h2>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-3">
            Manage your account settings, change password, or delete your account.
          </p>
          <div className="flex gap-3">
            <Button size="sm" variant="secondary" disabled>
              Change Password
            </Button>
            <Button size="sm" variant="danger" disabled>
              Delete Account
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
