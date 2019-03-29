/*
 * BrowserManager.js
 *
 * Created by shidong.ke on 3/29/19 3:03 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

import puppeteer from "puppeteer";

const pageNum = 50;
const maxPageNum = 100;
const maxGetIdlePageWaitTime = 1000; //ms

// 页面工作状态
const PageStatus = Object.freeze({
    'WAITING': 1,
    'WORKING': 2,
});


class BrowserManager {
    browser = null;
    pages = null;

    waitingIdleQueue = []

    async init(defaultPageNum = 50) {

        console.log('launch browser...');
        const browser = await puppeteer.launch({ headless: false });
        console.log('launch browser...down');


        // 监听browser有没有断开连接或者崩溃
        browser.on('disconnected', () => {
            this.init(defaultPageNum);

            browser.removeListener('disconnected');
        });

        this.browser = browser;

        const pages = Array(defaultPageNum)
            .fill(null)
            .map(() => ({instance: browser.newPage(), status: PageStatus.WAITING }));

        console.log('instance pages...');
        await Promise.all(pages.map(item => item.instance));
        console.log('instance pages...down');

        this.pages = pages;
    }

    async checkIdlePage(fn) {

    }

    async dynamicAddNewPage() {
        let newPage = null;

        const pagesLength = this.pages.length;

        if (!this.pages || pagesLength === 0 || pagesLength >= maxPageNum) return newPage;

        const workingPages = this.pages.filter((el) => {
            return el.status === PageStatus.WORKING
        });

        if (workingPages.length / this.pages.length > 2 / 3) {
            // 同步更改数组长度
            this.pages.push(null);
            const newPageIndex = this.pages.length - 1;


            // todo:if error
            newPage = {
                instance: await this.browser.newPage(),
                status: PageStatus.WAITING
            };

            this.pages[newPageIndex] = newPage;
        }

        return newPage;
    }

    async dynamicRemoveIdlePage() {
        if (!this.pages || this.pages.length <= pageNum) return;

        const workingPages = this.pages.filter((el) => {
            return el.status === PageStatus.WORKING
        });
        if (workingPages.length / this.pages.length > 2 / 3) {
            // todo:
            const page = this.pages.some((el) => {
                return el.status === PageStatus.WAITING
            })


            await page.close()
        }
    }

    async getIdlePage() {
        let idlePageInstance = null;

        if (!this.pages) {
            throw new Error('pages not be instance...');
        }

        // > 1 / 2

    }

    async getIdlePage(maxWaitingTime) {
        let idlePageInstance = null;

        if (!this.pages) {
            throw new Error('pages not be instance...');
        }

        if (this.pages.length > 0 && this.pages.length < maxPageNum) {
            this.pages.some((el) => {
                const isIdle = el.status === PageStatus.WAITING;
                if (isIdle) {
                    idlePageInstance = el.instance;
                }
                return isIdle;
            });
        } else {
            // create page
            await idlePageInstance = this.addNewPage();
        }


        if (idlePageInstance === null) {
            throw new Error('get idle page fail...');
        }


        this.occupyPage(idlePageInstance);
        return {
            instance: idlePageInstance,
            release: () => {
                this.releasePage(idlePageInstance);
            }
        };
    }

    on(type, fn) {
        switch (type) {
            case 'releasePage':

        }
    }

    setPageStatus(pageInstance, status) {
        if (!this.pages) {
            throw new Error('pages not be instance...');
        }

        const pageInstances = this.pages.map(item => item.instance);
        const instanceIndex = pageInstances.indexOf(pageInstance);

        if (instanceIndex === -1) {
            throw new Error('page instance not be found');
        }

        this.pages[instanceIndex].status = status;
    }

    async releasePage(pageInstance) {
        if (pageInstance) {
            this.setPageStatus(pageInstance, PageStatus.WAITING);
        }
    }

    async occupyPage(pageInstance) {
        this.setPageStatus(pageInstance, PageStatus.WORKING);
    }

}
