<template>
    <div class="border rounded-xl p-4 shadow-sm">
      <h3 class="text-lg font-semibold mb-4">🚚 Logistics Information</h3>
      <div class="space-y-2 text-sm text-gray-700">
        <div>
          <span class="font-medium">Company:</span> {{ logistics.company }}
        </div>
        <div>
          <span class="font-medium">Courier:</span> {{ logistics.courier }}
        </div>
        <div>
          <span class="font-medium">Phone:</span> {{ logistics.phone }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const logistics = {
    company: 'TrustExpress Logistics',
    courier: 'Zhang Wei',
    phone: '+86 135-1234-5678',
  }
  </script>
  
  <style scoped>
  </style>
  