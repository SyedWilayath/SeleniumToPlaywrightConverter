export type Language = 'java' | 'python' | 'javascript' | 'typescript' | 'csharp';

export function detectLanguage(code: string): Language {
    // Java detection
    if (code.includes('WebDriver') && (code.includes('import org.openqa.selenium') || code.includes('public class'))) {
        return 'java';
    }

    // Python detection
    if (code.includes('from selenium') || code.includes('import selenium') || code.includes('driver.find_element')) {
        return 'python';
    }

    // C# detection
    if (code.includes('using OpenQA.Selenium') || code.includes('IWebDriver') || code.includes('FindElement')) {
        return 'csharp';
    }

    // TypeScript detection
    if (code.includes(': WebDriver') || code.includes('Promise<void>') || code.includes('import {') && code.includes('selenium-webdriver')) {
        return 'typescript';
    }

    // JavaScript detection (default for selenium-webdriver)
    if (code.includes('require(') && code.includes('selenium-webdriver')) {
        return 'javascript';
    }

    // Default to JavaScript
    return 'javascript';
}

export function convertSeleniumToPlaywright(seleniumCode: string, targetLang: Language): string {
    let converted = seleniumCode;

    // Apply language-specific conversions
    switch (targetLang) {
        case 'java':
            converted = convertToJava(converted);
            break;
        case 'python':
            converted = convertToPython(converted);
            break;
        case 'javascript':
            converted = convertToJavaScript(converted);
            break;
        case 'typescript':
            converted = convertToTypeScript(converted);
            break;
        case 'csharp':
            converted = convertToCSharp(converted);
            break;
    }

    return converted;
}

function convertToJava(code: string): string {
    let result = code;

    // Import statements
    result = result.replace(/import org\.openqa\.selenium\.\*;?/g, 'import com.microsoft.playwright.*;');
    result = result.replace(/import org\.openqa\.selenium\.chrome\.ChromeDriver;?/g, '');
    result = result.replace(/import org\.openqa\.selenium\.By;?/g, '');
    result = result.replace(/import org\.openqa\.selenium\.WebElement;?/g, '');
    result = result.replace(/import org\.openqa\.selenium\.WebDriver;?/g, '');
    result = result.replace(/import org\.openqa\.selenium\.support\.ui\.WebDriverWait;?/g, '');
    result = result.replace(/import org\.openqa\.selenium\.support\.ui\.ExpectedConditions;?/g, '');
    result = result.replace(/import java\.time\.Duration;?/g, '');

    // Add Playwright imports at the beginning
    if (result.includes('import com.microsoft.playwright')) {
        result = result.replace(/import com\.microsoft\.playwright\.\*;/,
            'import com.microsoft.playwright.*;\nimport com.microsoft.playwright.options.*;');
    }

    // WebDriver initialization
    result = result.replace(/WebDriver\s+(\w+)\s*=\s*new\s+ChromeDriver\(\);?/g,
        'Playwright playwright = Playwright.create();\n        Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));\n        BrowserContext context = browser.newContext();\n        Page $1 = context.newPage();');

    // Navigation
    result = result.replace(/(\w+)\.get\("([^"]+)"\);?/g, '$1.navigate("$2");');
    result = result.replace(/(\w+)\.get\('([^']+)'\);?/g, '$1.navigate("$2");');

    // Window management
    result = result.replace(/(\w+)\.manage\(\)\.window\(\)\.maximize\(\);?/g, '$1.setViewportSize(1920, 1080);');

    // Element location - By.id
    result = result.replace(/(\w+)\.findElement\(By\.id\("([^"]+)"\)\)/g, '$1.locator("#$2")');
    result = result.replace(/(\w+)\.findElement\(By\.id\('([^']+)'\)\)/g, '$1.locator("#$2")');

    // Element location - By.name
    result = result.replace(/(\w+)\.findElement\(By\.name\("([^"]+)"\)\)/g, '$1.locator("[name=\'$2\']")');
    result = result.replace(/(\w+)\.findElement\(By\.name\('([^']+)'\)\)/g, '$1.locator("[name=\'$2\']")');

    // Element location - By.className
    result = result.replace(/(\w+)\.findElement\(By\.className\("([^"]+)"\)\)/g, '$1.locator(".$2")');
    result = result.replace(/(\w+)\.findElement\(By\.className\('([^']+)'\)\)/g, '$1.locator(".$2")');

    // Element location - By.cssSelector
    result = result.replace(/(\w+)\.findElement\(By\.cssSelector\("([^"]+)"\)\)/g, '$1.locator("$2")');
    result = result.replace(/(\w+)\.findElement\(By\.cssSelector\('([^']+)'\)\)/g, '$1.locator("$2")');

    // Element location - By.xpath
    result = result.replace(/(\w+)\.findElement\(By\.xpath\("([^"]+)"\)\)/g, '$1.locator("xpath=$2")');
    result = result.replace(/(\w+)\.findElement\(By\.xpath\('([^']+)'\)\)/g, '$1.locator("xpath=$2")');

    // Actions - sendKeys
    result = result.replace(/WebElement\s+(\w+)\s*=\s*([^;]+);?\s*\n\s*\1\.sendKeys\("([^"]+)"\);?/g,
        'Locator $1 = $2;\n        $1.fill("$3");');
    result = result.replace(/(\w+)\.sendKeys\("([^"]+)"\);?/g, '$1.fill("$2");');
    result = result.replace(/(\w+)\.sendKeys\('([^']+)'\);?/g, '$1.fill("$2");');

    // Actions - click
    result = result.replace(/WebElement\s+(\w+)\s*=\s*([^;]+);?\s*\n\s*\1\.click\(\);?/g,
        'Locator $1 = $2;\n        $1.click();');
    result = result.replace(/(\w+)\.click\(\);?/g, '$1.click();');

    // Waits
    result = result.replace(/WebDriverWait\s+wait\s*=\s*new\s+WebDriverWait\([^,]+,\s*Duration\.ofSeconds\((\d+)\)\);?/g,
        '// Playwright has built-in auto-waiting');
    result = result.replace(/WebElement\s+(\w+)\s*=\s*wait\.until\(\s*ExpectedConditions\.presenceOfElementLocated\(By\.className\("([^"]+)"\)\)\s*\);?/g,
        'Locator $1 = page.locator(".$2");\n        $1.waitFor();');

    // Cleanup - remove WebElement declarations that are now Locator
    result = result.replace(/WebElement\s+(\w+)\s*=/g, 'Locator $1 =');

    // Quit
    result = result.replace(/(\w+)\.quit\(\);?/g, 'browser.close();\n        playwright.close();');

    return result;
}

function convertToPython(code: string): string {
    let result = code;

    // Import statements
    result = result.replace(/from selenium import webdriver/g, 'from playwright.sync_api import sync_playwright');
    result = result.replace(/from selenium\.webdriver\.common\.by import By/g, '');
    result = result.replace(/from selenium\.webdriver\.support\.ui import WebDriverWait/g, '');
    result = result.replace(/from selenium\.webdriver\.support import expected_conditions as EC/g, '');
    result = result.replace(/from selenium\.webdriver\.chrome\.options import Options/g, '');

    // Driver initialization
    result = result.replace(/options\s*=\s*Options\(\)\s*\n/g, '');
    result = result.replace(/driver\s*=\s*webdriver\.Chrome\(options=options\)/g,
        'playwright = sync_playwright().start()\nbrowser = playwright.chromium.launch(headless=False)\ncontext = browser.new_context()\npage = context.new_page()');
    result = result.replace(/driver\s*=\s*webdriver\.Chrome\(\)/g,
        'playwright = sync_playwright().start()\nbrowser = playwright.chromium.launch(headless=False)\ncontext = browser.new_context()\npage = context.new_page()');

    // Navigation
    result = result.replace(/driver\.get\("([^"]+)"\)/g, 'page.goto("$1")');
    result = result.replace(/driver\.get\('([^']+)'\)/g, 'page.goto("$1")');

    // Window management
    result = result.replace(/driver\.maximize_window\(\)/g, 'page.set_viewport_size({"width": 1920, "height": 1080})');

    // Element location - By.ID
    result = result.replace(/driver\.find_element\(By\.ID,\s*"([^"]+)"\)/g, 'page.locator("#$1")');
    result = result.replace(/driver\.find_element\(By\.ID,\s*'([^']+)'\)/g, 'page.locator("#$1")');

    // Element location - By.NAME
    result = result.replace(/driver\.find_element\(By\.NAME,\s*"([^"]+)"\)/g, 'page.locator("[name=\'$1\']")');
    result = result.replace(/driver\.find_element\(By\.NAME,\s*'([^']+)'\)/g, 'page.locator("[name=\'$1\']")');

    // Element location - By.CLASS_NAME
    result = result.replace(/driver\.find_element\(By\.CLASS_NAME,\s*"([^"]+)"\)/g, 'page.locator(".$1")');
    result = result.replace(/driver\.find_element\(By\.CLASS_NAME,\s*'([^']+)'\)/g, 'page.locator(".$1")');

    // Element location - By.CSS_SELECTOR
    result = result.replace(/driver\.find_element\(By\.CSS_SELECTOR,\s*"([^"]+)"\)/g, 'page.locator("$1")');
    result = result.replace(/driver\.find_element\(By\.CSS_SELECTOR,\s*'([^']+)'\)/g, 'page.locator("$1")');

    // Element location - By.XPATH
    result = result.replace(/driver\.find_element\(By\.XPATH,\s*"([^"]+)"\)/g, 'page.locator("xpath=$1")');
    result = result.replace(/driver\.find_element\(By\.XPATH,\s*'([^']+)'\)/g, 'page.locator("xpath=$1")');

    // Actions - send_keys
    result = result.replace(/(\w+)\s*=\s*(page\.locator\([^)]+\))\s*\n\s*\1\.send_keys\("([^"]+)"\)/g, '$1 = $2\n$1.fill("$3")');
    result = result.replace(/(\w+)\.send_keys\("([^"]+)"\)/g, '$1.fill("$2")');
    result = result.replace(/(\w+)\.send_keys\('([^']+)'\)/g, '$1.fill("$2")');

    // Actions - click (already compatible)

    // Waits
    result = result.replace(/wait\s*=\s*WebDriverWait\(driver,\s*(\d+)\)\s*\n/g, '# Playwright has built-in auto-waiting\n');
    result = result.replace(/(\w+)\s*=\s*wait\.until\(\s*EC\.presence_of_element_located\(\(By\.CLASS_NAME,\s*"([^"]+)"\)\)\s*\)/g,
        '$1 = page.locator(".$2")\n$1.wait_for()');

    // Quit
    result = result.replace(/driver\.quit\(\)/g, 'browser.close()\nplaywright.stop()');

    // Replace driver with page
    result = result.replace(/\bdriver\b/g, 'page');

    return result;
}

function convertToJavaScript(code: string): string {
    let result = code;

    // Import statements
    result = result.replace(/const\s*{\s*Builder,\s*By,\s*until\s*}\s*=\s*require\('selenium-webdriver'\);?/g,
        "const { chromium } = require('playwright');");
    result = result.replace(/const\s+chrome\s*=\s*require\('selenium-webdriver\/chrome'\);?/g, '');

    // Driver initialization
    result = result.replace(/let\s+driver\s*=\s*await\s+new\s+Builder\(\)\s*\.forBrowser\('chrome'\)\s*\.build\(\);?/g,
        "const browser = await chromium.launch({ headless: false });\n    const context = await browser.newContext();\n    const page = await context.newPage();");

    // Navigation
    result = result.replace(/await\s+driver\.get\('([^']+)'\);?/g, "await page.goto('$1');");
    result = result.replace(/await\s+driver\.get\("([^"]+)"\);?/g, 'await page.goto("$1");');

    // Window management
    result = result.replace(/await\s+driver\.manage\(\)\.window\(\)\.maximize\(\);?/g,
        'await page.setViewportSize({ width: 1920, height: 1080 });');

    // Element location - By.id
    result = result.replace(/await\s+driver\.findElement\(By\.id\('([^']+)'\)\)/g, "page.locator('#$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.id\("([^"]+)"\)\)/g, 'page.locator("#$1")');

    // Element location - By.name
    result = result.replace(/await\s+driver\.findElement\(By\.name\('([^']+)'\)\)/g, "page.locator('[name=\"$1\"]')");
    result = result.replace(/await\s+driver\.findElement\(By\.name\("([^"]+)"\)\)/g, 'page.locator("[name=\'$1\']")');

    // Element location - By.className
    result = result.replace(/await\s+driver\.findElement\(By\.className\('([^']+)'\)\)/g, "page.locator('.$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.className\("([^"]+)"\)\)/g, 'page.locator(".$1")');

    // Element location - By.css
    result = result.replace(/await\s+driver\.findElement\(By\.css\('([^']+)'\)\)/g, "page.locator('$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.css\("([^"]+)"\)\)/g, 'page.locator("$1")');

    // Element location - By.xpath
    result = result.replace(/await\s+driver\.findElement\(By\.xpath\('([^']+)'\)\)/g, "page.locator('xpath=$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.xpath\("([^"]+)"\)\)/g, 'page.locator("xpath=$1")');

    // Actions - sendKeys
    result = result.replace(/const\s+(\w+)\s*=\s*(page\.locator\([^)]+\));?\s*\n\s*await\s+\1\.sendKeys\('([^']+)'\);?/g,
        "const $1 = $2;\n        await $1.fill('$3');");
    result = result.replace(/await\s+(\w+)\.sendKeys\('([^']+)'\);?/g, "await $1.fill('$2');");
    result = result.replace(/await\s+(\w+)\.sendKeys\("([^"]+)"\);?/g, 'await $1.fill("$2");');

    // Actions - click
    result = result.replace(/const\s+(\w+)\s*=\s*(page\.locator\([^)]+\));?\s*\n\s*await\s+\1\.click\(\);?/g,
        "const $1 = $2;\n        await $1.click();");

    // Waits
    result = result.replace(/await\s+driver\.wait\(\s*until\.elementLocated\(By\.className\('([^']+)'\)\),\s*\d+\s*\);?/g,
        "await page.locator('.$1').waitFor();");

    // Quit
    result = result.replace(/await\s+driver\.quit\(\);?/g, 'await browser.close();');

    return result;
}

function convertToTypeScript(code: string): string {
    let result = code;

    // Import statements
    result = result.replace(/import\s*{\s*Builder,\s*By,\s*until,\s*WebDriver\s*}\s*from\s*'selenium-webdriver';?/g,
        "import { chromium, Browser, BrowserContext, Page } from 'playwright';");
    result = result.replace(/import\s*\*\s*as\s*chrome\s*from\s*'selenium-webdriver\/chrome';?/g, '');

    // Function signature
    result = result.replace(/async\s+function\s+(\w+)\(\):\s*Promise<void>\s*{/g,
        'async function $1(): Promise<void> {');

    // Driver initialization
    result = result.replace(/let\s+driver:\s*WebDriver\s*=\s*await\s+new\s+Builder\(\)\s*\.forBrowser\('chrome'\)\s*\.build\(\);?/g,
        "const browser: Browser = await chromium.launch({ headless: false });\n    const context: BrowserContext = await browser.newContext();\n    const page: Page = await context.newPage();");

    // Navigation
    result = result.replace(/await\s+driver\.get\('([^']+)'\);?/g, "await page.goto('$1');");
    result = result.replace(/await\s+driver\.get\("([^"]+)"\);?/g, 'await page.goto("$1");');

    // Window management
    result = result.replace(/await\s+driver\.manage\(\)\.window\(\)\.maximize\(\);?/g,
        'await page.setViewportSize({ width: 1920, height: 1080 });');

    // Element location - By.id
    result = result.replace(/await\s+driver\.findElement\(By\.id\('([^']+)'\)\)/g, "page.locator('#$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.id\("([^"]+)"\)\)/g, 'page.locator("#$1")');

    // Element location - By.name
    result = result.replace(/await\s+driver\.findElement\(By\.name\('([^']+)'\)\)/g, "page.locator('[name=\"$1\"]')");
    result = result.replace(/await\s+driver\.findElement\(By\.name\("([^"]+)"\)\)/g, 'page.locator("[name=\'$1\']")');

    // Element location - By.className
    result = result.replace(/await\s+driver\.findElement\(By\.className\('([^']+)'\)\)/g, "page.locator('.$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.className\("([^"]+)"\)\)/g, 'page.locator(".$1")');

    // Element location - By.css
    result = result.replace(/await\s+driver\.findElement\(By\.css\('([^']+)'\)\)/g, "page.locator('$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.css\("([^"]+)"\)\)/g, 'page.locator("$1")');

    // Element location - By.xpath
    result = result.replace(/await\s+driver\.findElement\(By\.xpath\('([^']+)'\)\)/g, "page.locator('xpath=$1')");
    result = result.replace(/await\s+driver\.findElement\(By\.xpath\("([^"]+)"\)\)/g, 'page.locator("xpath=$1")');

    // Actions - sendKeys
    result = result.replace(/const\s+(\w+)\s*=\s*(page\.locator\([^)]+\));?\s*\n\s*await\s+\1\.sendKeys\('([^']+)'\);?/g,
        "const $1 = $2;\n        await $1.fill('$3');");
    result = result.replace(/await\s+(\w+)\.sendKeys\('([^']+)'\);?/g, "await $1.fill('$2');");
    result = result.replace(/await\s+(\w+)\.sendKeys\("([^"]+)"\);?/g, 'await $1.fill("$2");');

    // Actions - click
    result = result.replace(/const\s+(\w+)\s*=\s*(page\.locator\([^)]+\));?\s*\n\s*await\s+\1\.click\(\);?/g,
        "const $1 = $2;\n        await $1.click();");

    // Waits
    result = result.replace(/await\s+driver\.wait\(\s*until\.elementLocated\(By\.className\('([^']+)'\)\),\s*\d+\s*\);?/g,
        "await page.locator('.$1').waitFor();");

    // Quit
    result = result.replace(/await\s+driver\.quit\(\);?/g, 'await browser.close();');

    return result;
}

function convertToCSharp(code: string): string {
    let result = code;

    // Using statements
    result = result.replace(/using OpenQA\.Selenium;?/g, 'using Microsoft.Playwright;');
    result = result.replace(/using OpenQA\.Selenium\.Chrome;?/g, '');
    result = result.replace(/using OpenQA\.Selenium\.Support\.UI;?/g, '');
    result = result.replace(/using System;?/g, 'using System;\nusing System.Threading.Tasks;');

    // Method signature - make async
    result = result.replace(/public\s+static\s+void\s+Main\(string\[\]\s+args\)/g,
        'public static async Task Main(string[] args)');

    // Driver initialization
    result = result.replace(/IWebDriver\s+driver\s*=\s*new\s+ChromeDriver\(\);?/g,
        'var playwright = await Playwright.CreateAsync();\n        var browser = await playwright.Chromium.LaunchAsync(new() { Headless = false });\n        var context = await browser.NewContextAsync();\n        var page = await context.NewPageAsync();');

    // Navigation
    result = result.replace(/driver\.Navigate\(\)\.GoToUrl\("([^"]+)"\);?/g, 'await page.GotoAsync("$1");');
    result = result.replace(/driver\.Navigate\(\)\.GoToUrl\('([^']+)'\);?/g, 'await page.GotoAsync("$1");');

    // Window management
    result = result.replace(/driver\.Manage\(\)\.Window\.Maximize\(\);?/g,
        'await page.SetViewportSizeAsync(1920, 1080);');

    // Element location - By.Id
    result = result.replace(/driver\.FindElement\(By\.Id\("([^"]+)"\)\)/g, 'page.Locator("#$1")');
    result = result.replace(/driver\.FindElement\(By\.Id\('([^']+)'\)\)/g, 'page.Locator("#$1")');

    // Element location - By.Name
    result = result.replace(/driver\.FindElement\(By\.Name\("([^"]+)"\)\)/g, 'page.Locator("[name=\'$1\']")');
    result = result.replace(/driver\.FindElement\(By\.Name\('([^']+)'\)\)/g, 'page.Locator("[name=\'$1\']")');

    // Element location - By.ClassName
    result = result.replace(/driver\.FindElement\(By\.ClassName\("([^"]+)"\)\)/g, 'page.Locator(".$1")');
    result = result.replace(/driver\.FindElement\(By\.ClassName\('([^']+)'\)\)/g, 'page.Locator(".$1")');

    // Element location - By.CssSelector
    result = result.replace(/driver\.FindElement\(By\.CssSelector\("([^"]+)"\)\)/g, 'page.Locator("$1")');
    result = result.replace(/driver\.FindElement\(By\.CssSelector\('([^']+)'\)\)/g, 'page.Locator("$1")');

    // Element location - By.XPath
    result = result.replace(/driver\.FindElement\(By\.XPath\("([^"]+)"\)\)/g, 'page.Locator("xpath=$1")');
    result = result.replace(/driver\.FindElement\(By\.XPath\('([^']+)'\)\)/g, 'page.Locator("xpath=$1")');

    // Actions - SendKeys
    result = result.replace(/IWebElement\s+(\w+)\s*=\s*(page\.Locator\([^)]+\));?\s*\n\s*\1\.SendKeys\("([^"]+)"\);?/g,
        'var $1 = $2;\n        await $1.FillAsync("$3");');
    result = result.replace(/(\w+)\.SendKeys\("([^"]+)"\);?/g, 'await $1.FillAsync("$2");');
    result = result.replace(/(\w+)\.SendKeys\('([^']+)'\);?/g, 'await $1.FillAsync("$2");');

    // Actions - Click
    result = result.replace(/IWebElement\s+(\w+)\s*=\s*(page\.Locator\([^)]+\));?\s*\n\s*\1\.Click\(\);?/g,
        'var $1 = $2;\n        await $1.ClickAsync();');
    result = result.replace(/(\w+)\.Click\(\);?/g, 'await $1.ClickAsync();');

    // Waits
    result = result.replace(/WebDriverWait\s+wait\s*=\s*new\s+WebDriverWait\(driver,\s*TimeSpan\.FromSeconds\(\d+\)\);?/g,
        '// Playwright has built-in auto-waiting');
    result = result.replace(/IWebElement\s+(\w+)\s*=\s*wait\.Until\(\s*SeleniumExtras\.WaitHelpers\.ExpectedConditions\.ElementExists\(\s*By\.ClassName\("([^"]+)"\)\s*\)\s*\);?/g,
        'var $1 = page.Locator(".$2");\n        await $1.WaitForAsync();');

    // Cleanup - remove IWebElement declarations
    result = result.replace(/IWebElement\s+(\w+)\s*=/g, 'var $1 =');

    // Quit
    result = result.replace(/driver\.Quit\(\);?/g, 'await browser.CloseAsync();');

    return result;
}
