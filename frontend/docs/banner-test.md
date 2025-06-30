---
id: banner-test
title: Banner Component Test
sidebar_position: 100
---

import DeveloperBusinessCard from '@site/src/components/banner/banner';
import SimpleTest from '@site/src/components/banner/SimpleTest';

# Banner Component Test

This is a test page to preview the developer business card banner component.

## Tailwind CSS Test

<div className="bg-red-500 text-white p-4 rounded-lg mb-4">
  🔥 **If you see this red box with white text, Tailwind CSS is working!**
</div>

## Debug Test

<div style={{padding: '20px', border: '2px solid red', margin: '20px 0'}}>
  <p>This red border should be visible if MDX is working</p>
</div>

<SimpleTest />

## Banner Component

<div className="max-w-4xl mx-auto" style={{border: '2px solid blue', padding: '20px'}}>
  <DeveloperBusinessCard />
</div>

## Fallback Test

<div style={{height: '200px', backgroundColor: 'lightgray', padding: '20px'}}>
  <p>If you see this gray box, styling is working but the component might not be rendering</p>
</div> 