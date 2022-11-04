
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(1000)
})
test('clicking the Draw button displays cards', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.sleep(1000)
    const cards = await driver.findElement(By.id('choices'))
    const displayed = await cards.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(500)
})
test('Clicking an Add to Duo button displays your duo', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.findElement(By.className('bot-btn')).click()
    await driver.sleep(2000)
    const card = await driver.findElement(By.id('player-duo'))
    const displayed = await card.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(1000)
})