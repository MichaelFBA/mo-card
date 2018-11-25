import template from './template.js';

class MoCard extends HTMLElement {
    constructor() {
        super();
        this.shadowroot = this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');
    }

    static get observedAttributes() {
        return ['mobro', 'mosista'];
    }

    async render(gender, id) {
        const data = await this.getProfile(gender, id);

        this.template.innerHTML = template(data);
        this.shadowroot.appendChild(document.importNode(this.template.content, true));
    }

    connectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render(name, newValue)
    }

    async getProfile(gender, id) {
        if (localStorage.getItem(id)) {
            return JSON.parse(localStorage.getItem(id));
        }
        const url = this.getMovemberProfileUrl(gender, id);

        const doc = await fetch(url).then(res => res.text())
            .then(text => new DOMParser().parseFromString(text.replace(/\\"/g, '"').replace(/\\n/g, ''), 'text/html'))

        const data = {
            image: this.getImage(doc),
            name: doc.querySelector('h1.mospace-heroarea--name').textContent.trim(),
            donate: doc.querySelector('.mospace-heroarea--donate-to-me-btn').href
        }
        localStorage.setItem(id, JSON.stringify(data))

        return data;
    }

    getMovemberProfileUrl(gender, id) {
        const who = {
            mobro: `https://allorigins.me/get?url=https%3A//mobro.co/${id}&callback=?`,
            mosista: `https://allorigins.me/get?url=https%3A//mosista.co/${id}&callback=?`,
        }
        return who[gender];
    }

    getImage(doc) {
        let image = doc.querySelector('mospace-heroarea img');
        if (image) {
            //If single image
            return image.src;
        } else {
            //Slider
            return JSON.parse(doc.querySelector('#mospace-heroarea--profile-pictures-slider').dataset.initImages)[0].src.replace(/\\/g, '')
        }
    }
}

customElements.define('mo-card', MoCard);