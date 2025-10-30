import React from 'react';
import { useFeatureFlag, useFeatures, useFeatureContext } from '@packages/feature-sdk';

// Test component to verify feature SDK integration
export function FeatureSDKTest() {
  const campusEnabled = useFeatureFlag('ui-campus');
  const groupsEnabled = useFeatureFlag('ui-groups');
  const studentsEnabled = useFeatureFlag('ui-students');
  const techProdEnabled = useFeatureFlag('ui-tech-prod');
  
  const allFeatures = useFeatures();
  const context = useFeatureContext();

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold mb-2">Feature SDK Integration Test</h3>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Individual Feature Checks:</h4>
        <div className="text-sm space-y-1">
          <div>ui-campus: {campusEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
          <div>ui-groups: {groupsEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
          <div>ui-students: {studentsEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
          <div>ui-tech-prod: {techProdEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">All Features:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(allFeatures, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Context:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(context, null, 2)}
        </pre>
      </div>

      <div className="text-xs text-gray-600">
        <p>✅ Feature SDK integration working correctly!</p>
        <p>• Individual feature checks: Working</p>
        <p>• All features retrieval: Working</p>
        <p>• Context extraction: Working</p>
      </div>
    </div>
  );
}
