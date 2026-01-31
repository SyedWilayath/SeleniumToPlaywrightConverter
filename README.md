# Selenium to Playwright Converter

A modern web application that converts Selenium WebDriver code to Playwright code across multiple programming languages.

## 🚀 Features

- **Multi-Language Support**: Convert between Java, Python, JavaScript, TypeScript, and C#
- **Real-Time Conversion**: See results as you type
- **Smart Detection**: Automatically detects source language
- **Theme Toggle**: Beautiful light and dark themes
- **Copy & Download**: Easy code export
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- React 18.2
- TypeScript 5.3
- Vite 5.0
- Vanilla CSS

## 📦 Installation

```bash
npm install
```

## 🏃 Running Locally

### Development Mode
```bash
npm run dev
```
Visit http://localhost:5173/

### Production Build
```bash
npm run build
npm run preview
```

## 🌐 Deployment

The application is built as a static site and can be deployed to:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Any static hosting service

Build output is in the `dist/` folder.

## 📝 Usage

1. **Select Input Language**: Choose the language of your Selenium code
2. **Paste or Type Code**: Enter your Selenium code in the left panel
3. **Select Output Language**: Choose your target Playwright language
4. **View Conversion**: See the converted code in the right panel
5. **Copy or Download**: Use the buttons to export your code

## 🎨 Supported Conversions

### Element Locators
- `By.id()` → `locator("#id")`
- `By.name()` → `locator("[name='name']")`
- `By.className()` → `locator(".class")`
- `By.cssSelector()` → `locator("selector")`
- `By.xpath()` → `locator("xpath=...")`

### Actions
- `sendKeys()` → `fill()`
- `click()` → `click()`
- `clear()` → `clear()`

### Browser Operations
- `driver.get()` → `page.goto()`
- `driver.navigate()` → `page.goto()`
- `driver.quit()` → `browser.close()`

### Waits
- `WebDriverWait` → Built-in auto-waiting
- `ExpectedConditions` → `waitFor()`

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with ❤️ for the testing community
