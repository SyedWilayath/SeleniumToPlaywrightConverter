export const samples = {
    java: `// Selenium WebDriver - Java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class LoginTest {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        
        try {
            driver.get("https://example.com/login");
            driver.manage().window().maximize();
            
            WebElement usernameField = driver.findElement(By.id("username"));
            usernameField.sendKeys("testuser");
            
            WebElement passwordField = driver.findElement(By.name("password"));
            passwordField.sendKeys("password123");
            
            WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));
            loginButton.click();
            
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement dashboard = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.className("dashboard"))
            );
            
            System.out.println("Login successful!");
        } finally {
            driver.quit();
        }
    }
}`,

    python: `# Selenium WebDriver - Python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# Setup Chrome driver
options = Options()
driver = webdriver.Chrome(options=options)

try:
    # Navigate to login page
    driver.get("https://example.com/login")
    driver.maximize_window()
    
    # Find and fill username
    username_field = driver.find_element(By.ID, "username")
    username_field.send_keys("testuser")
    
    # Find and fill password
    password_field = driver.find_element(By.NAME, "password")
    password_field.send_keys("password123")
    
    # Click login button
    login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    login_button.click()
    
    # Wait for dashboard to appear
    wait = WebDriverWait(driver, 10)
    dashboard = wait.until(
        EC.presence_of_element_located((By.CLASS_NAME, "dashboard"))
    )
    
    print("Login successful!")
finally:
    driver.quit()`,

    javascript: `// Selenium WebDriver - JavaScript
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function loginTest() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();
    
    try {
        await driver.get('https://example.com/login');
        await driver.manage().window().maximize();
        
        const usernameField = await driver.findElement(By.id('username'));
        await usernameField.sendKeys('testuser');
        
        const passwordField = await driver.findElement(By.name('password'));
        await passwordField.sendKeys('password123');
        
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();
        
        await driver.wait(
            until.elementLocated(By.className('dashboard')),
            10000
        );
        
        console.log('Login successful!');
    } finally {
        await driver.quit();
    }
}

loginTest();`,

    typescript: `// Selenium WebDriver - TypeScript
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

async function loginTest(): Promise<void> {
    let driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .build();
    
    try {
        await driver.get('https://example.com/login');
        await driver.manage().window().maximize();
        
        const usernameField = await driver.findElement(By.id('username'));
        await usernameField.sendKeys('testuser');
        
        const passwordField = await driver.findElement(By.name('password'));
        await passwordField.sendKeys('password123');
        
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();
        
        await driver.wait(
            until.elementLocated(By.className('dashboard')),
            10000
        );
        
        console.log('Login successful!');
    } finally {
        await driver.quit();
    }
}

loginTest();`,

    csharp: `// Selenium WebDriver - C#
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;

public class LoginTest
{
    public static void Main(string[] args)
    {
        IWebDriver driver = new ChromeDriver();
        
        try
        {
            driver.Navigate().GoToUrl("https://example.com/login");
            driver.Manage().Window.Maximize();
            
            IWebElement usernameField = driver.FindElement(By.Id("username"));
            usernameField.SendKeys("testuser");
            
            IWebElement passwordField = driver.FindElement(By.Name("password"));
            passwordField.SendKeys("password123");
            
            IWebElement loginButton = driver.FindElement(By.CssSelector("button[type='submit']"));
            loginButton.Click();
            
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            IWebElement dashboard = wait.Until(
                SeleniumExtras.WaitHelpers.ExpectedConditions.ElementExists(
                    By.ClassName("dashboard")
                )
            );
            
            Console.WriteLine("Login successful!");
        }
        finally
        {
            driver.Quit();
        }
    }
}`
};
