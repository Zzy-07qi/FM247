import { useState } from "react";
import '../../styles/Lvl.css'


function Lvl({ lvl }) {

    return (
        <div className="lvl-all">
            <div className="lvl">{`等级${lvl}`}</div>
            <div className="experence">距离下一级还差 经验值</div>
        </div>
    )
}
export default Lvl