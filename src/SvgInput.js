import React, { Component } from 'react';
import anime from 'animejs';

class SvgInput extends Component {
    constructor(props) {
        super(props);

        this.state = { isClinged: false };
        this.pathRef = React.createRef();
        this.handleSvgLineMouseMove = this.handleSvgLineMouseMove.bind(this);
        this.handleSvgLineMouseLeave = this.handleSvgLineMouseLeave.bind(this);
    }

    handleSvgLineMouseMove(event) {
        const boundingClientRect = event.target.getBoundingClientRect();
        const topEdge = Math.round(boundingClientRect.top);
        if (event.clientY >= topEdge && event.clientY <= topEdge + 5) {
            this.setState({ isClinged: true });
        } else if (this.state.isClinged) {
            anime.remove(this.pathRef.current);
            const xEnterPoint = event.clientX - boundingClientRect.left;
            const y = event.clientY - boundingClientRect.top;
            this.pathRef.current.setAttribute('d', `M0,0Q${xEnterPoint},${y},${this.props.width},0`);
        }
    }

    handleSvgLineMouseLeave() {
        this.setState({ isClinged: false });
        anime({
            targets: this.pathRef.current,
            d: `M0,0Q${this.props.width/2},0,${this.props.width},0`,
            duration: 500,
            elasticity: 800
        });
    }

    render() {
        const {
            width
        } = this.props;

        return (
            <div className="svg-input" style={ { width: `${width}px` } }>
                <input
                    type="text"
                    placeholder="you can type here..."
                    // onMouseLeave={  }
                />
                <svg
                    className="svg-line"
                    viewBox={ `0 0 ${width} 20` }
                    preserveAspectRatio="none"
                    onMouseMove={ this.handleSvgLineMouseMove }
                    onMouseLeave={ this.handleSvgLineMouseLeave }
                >
                    <defs>
                        <filter
                            id="path-shadow"
                            x="0"
                            y="-50%"
                            width="1000%"
                            height="200%"
                            filterUnits="userSpaceOnUse"
                        >
                            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="2"/>
                            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2"/>
                            <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
                        </filter>
                    </defs>
                    <path
                        ref={ this.pathRef }
                        strokeWidth="1"
                        stroke="orange"
                        fill="transparent"
                        d={ `M0,0Q${this.props.width / 2},0,${width},0` }
                        filter="url(#path-shadow)"
                    />
                </svg>
            </div>
        );
    }
}

export default SvgInput;
