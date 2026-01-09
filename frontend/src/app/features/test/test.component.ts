import { Component } from "@angular/core";

@Component({
  selector: "app-test",
  standalone: true,
  template: `
    <div class="p-8 bg-blue-50 min-h-screen">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-blue-900 mb-4">Test Route Works!</h1>
        <p class="text-lg text-blue-700 mb-6">This confirms routing is functional.</p>
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">Angular Intranet Status</h2>
          <ul class="space-y-2">
            <li class="flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Angular Server: Running</span>
            </li>
            <li class="flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Routing: Working</span>
            </li>
            <li class="flex items-center">
              <span class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
              <span>Backend: Check localhost:8000</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class TestComponent {}
