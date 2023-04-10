class RunGetAllRoom {
  
  constructor(checkin,checkout, BrowserService) {
    this.checkin = checkin;
    this.checkout = checkout;
    this.browser = BrowserService;
  }

  setTransformerDateToCalendar  ()  {
    const [day, month, year] = this.checkin.split('/');
    const date = new Date(`${month}/${day}/${year}`);
    const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayFormatted = date.getDate().toString().padStart(2, '0');
    const yearFormatted = date.getFullYear();
    return `${monthFormatted}/${dayFormatted}/${yearFormatted}`;
  }

  async setInputValue (page) {
    const date = this.setTransformerDateToCalendar();
    const checkin = this.checkin;
    const checkout = this.checkout;

    await page.$eval('input#var-busca-chegada', (el, checkin) => el.value = checkin, checkin);
    await page.$eval('input#var-busca-partida', (el,checkout ) => el.value = checkout, checkout);
    await page.$eval('input#var-data-calendario', (el,date) => el.value = date, date);
  };

  async enableSearchButton (page)  {
    const buttonHandle = await page.$('#busca-btn');
    await page.waitForSelector('#busca-btn');
    await buttonHandle.evaluate(button => {
      button.classList.remove('disabled');
      button.classList.add('mcolor-action-btn');
    });

    await page.waitForTimeout(1000);
    await buttonHandle.click();
  };

  async getAvailableRooms (page) {
    await page.waitForSelector('#tblAcomodacoes');

    const rooms = await page.$$eval('#tblAcomodacoes > tbody > tr', trNodes => {
      return Array.from(trNodes).map(tr => ({
        image: tr.querySelector('img[data-src]').dataset.src,
        name: tr.querySelector('span.quartoNome').textContent.toUpperCase(),
        price: tr.querySelector('span.valorFinal').textContent,
        description: tr.querySelector('div.quartoDescricao p').textContent,
      }));
    });
    return rooms;
  };

  async checkUnavailabilityModal  (page) {

    const tableRooms = page.waitForSelector('#tblAcomodacoes');
    const modal = page.waitForSelector('.hotel-selecionado-indisponivel-titulo');

    await Promise.race([tableRooms, modal]);

    const pageHotelSelecionado = await page.$('.hotel-selecionado-indisponivel-titulo');

    if (pageHotelSelecionado) {
      const textModal = await page.$$eval('.hotel-selecionado-indisponivel-titulo', modal => {
        return modal[0].innerText
      }); 

      return textModal
    } else {
      return null;
    }
  };

  async searchRooms ()  {
    const browser = await this.browser.getBrowser();
    let page = await browser.newPage();
    await page.goto('https://pratagy.letsbook.com.br/D/Busca');
    await this.setInputValue(page);
    await this.enableSearchButton(page);
      
    const existModalUnavailability = await this.checkUnavailabilityModal(page);

    if (existModalUnavailability) {
      await this.browser.closeBrowser(browser);
      const err = new Error(existModalUnavailability);
      err.status = 202;
      throw err;
    } else {
      const rooms = await this.getAvailableRooms(page);
      await this.browser.closeBrowser(browser);
      return rooms;
    }
  };
}

module.exports = RunGetAllRoom;