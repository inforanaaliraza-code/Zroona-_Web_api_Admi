#!/usr/bin/env node

/**
 * Hydration Validation Script
 * Checks for common hydration issues in Next.js projects
 * 
 * Usage: node check-hydration.js
 */

const fs = require("fs");
const path = require("path");

const CHECKS = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function log(level, message) {
  const icons = {
    pass: "[OK]",
    fail: "[X]",
    warn: "[!]",
    info: "[i]",
  };

  const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
  };

  switch (level) {
    case "pass":
      console.log(`${colors.green}${icons.pass} PASS:${colors.reset} ${message}`);
      CHECKS.passed++;
      break;
    case "fail":
      console.log(`${colors.red}${icons.fail} FAIL:${colors.reset} ${message}`);
      CHECKS.failed++;
      break;
    case "warn":
      console.log(`${colors.yellow}${icons.warn} WARN:${colors.reset} ${message}`);
      CHECKS.warnings++;
      break;
    case "info":
      console.log(`${colors.blue}${icons.info} INFO:${colors.reset} ${message}`);
      break;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    return null;
  }
}

function checkHydrationHooks() {
  log("info", "Checking hydration helper hooks...");
  const hookPath = path.join(__dirname, "src/hooks/useHydratedState.js");

  if (fileExists(hookPath)) {
    const content = readFile(hookPath);
    if (content.includes("useHydratedState") && content.includes("useLocalStorage")) {
      log("pass", "Hydration hooks are properly installed");
    } else {
      log("warn", "Hydration hooks exist but may be incomplete");
    }
  } else {
    log("fail", "useHydratedState.js not found - run npm run fix:hydration");
  }
}

function checkProvidersComponent(folder) {
  log("info", `Checking Providers component in ${folder}...`);
  const paths = [
    path.join(__dirname, folder, "src/components/Providers.jsx"),
    path.join(__dirname, folder, "src/components/Providers/ClientProviders.jsx"),
  ];

  let found = false;
  for (const providersPath of paths) {
    if (fileExists(providersPath)) {
      const content = readFile(providersPath);
      found = true;

      if (content.includes("useEffect") && content.includes("isMounted")) {
        log("pass", `${folder}: Providers properly handles hydration`);
      } else {
        log("fail", `${folder}: Providers missing hydration handling`);
      }
      break;
    }
  }

  if (!found) {
    log("warn", `${folder}: Providers component not found in expected location`);
  }
}

function checkMiddleware(folder) {
  log("info", `Checking middleware in ${folder}...`);
  const middlewarePath = path.join(__dirname, folder, "src/middleware.ts");

  if (fileExists(middlewarePath)) {
    const content = readFile(middlewarePath);
    if (content.includes("protectedRoutes") && content.includes("NextResponse")) {
      log("pass", `${folder}: Route protection middleware is installed`);
    } else {
      log("warn", `${folder}: Middleware exists but may be incomplete`);
    }
  } else {
    log("warn", `${folder}: middleware.ts not found - routes are not protected`);
  }
}

function checkHydrationWrappers() {
  log("info", "Checking HydrationSafeWrapper component...");
  const wrapperPath = path.join(__dirname, "web/src/components/HydrationSafeWrapper.jsx");

  if (fileExists(wrapperPath)) {
    const content = readFile(wrapperPath);
    if (content.includes("HydrationSafeWrapper") && content.includes("NoHydration")) {
      log("pass", "HydrationSafeWrapper components are available");
    } else {
      log("warn", "HydrationSafeWrapper exists but may be incomplete");
    }
  } else {
    log("warn", "HydrationSafeWrapper.jsx not found - hydration guards unavailable");
  }
}

function checkLayoutFiles() {
  log("info", "Checking layout files for hydration warnings...");

  const layouts = [
    { path: "web/src/app/layout.js", name: "Web Layout" },
    { path: "admin/src/app/layout.js", name: "Admin Layout" },
  ];

  for (const { path: layoutPath, name } of layouts) {
    const fullPath = path.join(__dirname, layoutPath);
    if (fileExists(fullPath)) {
      const content = readFile(fullPath);
      if (content.includes("suppressHydrationWarning")) {
        log("pass", `${name}: Has suppressHydrationWarning attribute`);
      } else {
        log("warn", `${name}: Missing suppressHydrationWarning attribute`);
      }
    } else {
      log("warn", `${name}: Not found at ${layoutPath}`);
    }
  }
}

function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("HYDRATION CHECK SUMMARY");
  console.log("=".repeat(60));
  console.log(`[OK] Passed: ${CHECKS.passed}`);
  console.log(`[X] Failed: ${CHECKS.failed}`);
  console.log(`[!] Warnings: ${CHECKS.warnings}`);

  const totalChecks = CHECKS.passed + CHECKS.failed + CHECKS.warnings;
  const passRate = Math.round((CHECKS.passed / totalChecks) * 100);

  console.log(`\nPass Rate: ${passRate}%`);

  if (CHECKS.failed === 0) {
    console.log("\n[OK] All critical hydration checks passed!");
  } else {
    console.log("\n[X] Some critical checks failed. Please fix them.");
    process.exit(1);
  }
}

function main() {
  console.log("\n" + "=".repeat(60));
  console.log("NEXTJS HYDRATION ERROR CHECKER");
  console.log("=".repeat(60) + "\n");

  checkHydrationHooks();
  console.log();

  checkProvidersComponent("web");
  console.log();

  checkProvidersComponent("admin");
  console.log();

  checkMiddleware("web");
  checkMiddleware("admin");
  console.log();

  checkHydrationWrappers();
  console.log();

  checkLayoutFiles();
  console.log();

  printSummary();
}

main();
