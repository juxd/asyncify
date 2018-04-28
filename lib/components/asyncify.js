import React, {Component} from 'react';
import * as Parallel from 'async-parallel';

const asyncify = (FunctionalComponent, preloadValues) => {
    function getInitialReqStatus(preloadValues) {
        const keys = Object.keys(preloadValues);
        var initialReqStatus = {}
        keys.forEach((key) => {
            initialReqStatus[key] = false;
        });
        return initialReqStatus;
    }

    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                reqStatus: getInitialReqStatus(preloadValues),
                allData: preloadValues
            }
            this.fetcher = this.fetcher.bind(this);
            this.fetcherWrapper = this.fetcherWrapper.bind(this);
        }

        // returns an object with the name, callback, and data
        // callback is not included if the request is already complete
        fetcher(name, callback) {
            var fetcherObj = {
                name,
                data: this.state.allData[name],
            }

            if (!this.state.reqStatus[name]) {
                fetcherObj.callback = async () => await callback();
            }
            return fetcherObj;
        }

        async fetcherWrapper(...fetchers) {
            if (!fetchers[0].callback) {
                return;
            }

            var newAllData = {};
            var newReqStatus = {};
            await Parallel.each(fetchers, async (fetcher) => {
                newAllData[fetcher.name] = await fetcher.callback();
                newReqStatus[fetcher.name] = true;
            });

            const newState = {
                allData: newAllData,
                reqStatus: newReqStatus
            };

            this.setState(newState);
        }

        render() {
            return (
                <FunctionalComponent fetcherWrapper={this.fetcherWrapper} fetcher={this.fetcher} {...this.props}/>
            );
        }
    }
}

export default asyncify;
