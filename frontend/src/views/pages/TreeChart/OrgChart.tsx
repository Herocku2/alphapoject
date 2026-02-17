import { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Misc/Loading";
// @ts-ignore
import { OrgChart } from 'd3-org-chart';
import { useTranslation } from "react-i18next";

export const OrgChartComponent = ({ data }: { data: TreeLeaf[] }) => {
    const d3Container = useRef(null);
    const [chartRendered, setChartRendered] = useState(false)
    const {t} = useTranslation()
    const [width, setWidth] = useState(0)
    // We need to manipulate DOM
    useEffect(() => {
        if (data && d3Container.current) {
            setTimeout(() =>{
                const tree_svg_width = document.getElementById("container-chart")?.getBoundingClientRect().width
                setWidth(tree_svg_width || 0)
                const chart = new OrgChart()
                    .nodeHeight((d) => 85 + 25)
                    .nodeWidth((d) => 220 + 2)
                    .svgWidth(tree_svg_width)
                    .svgHeight(window.innerHeight)
                    .initialZoom(0.7)
                    .childrenMargin((d) => 50)
                    .compactMarginBetween((d) => 35)
                    .compactMarginPair((d) => 30)
                    .neighbourMargin((a, b) => 20)
                    .nodeContent(function (d, i, arr, state) {
                        const color = '#FFFFFF';
                        const imageDiffVert = 25 + 2;
                        return `
                                <div style='width:${d.width}px;
                                        height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px'>
                                        <div class="" style="background-color: #343a40;font-family: 'Inter', sans-serif;  margin-left:-1px;width:${d.width - 2}px;
                                        height:${d.height - imageDiffVert}px;border-radius:10px;border: ${!d.data.is_master_code ? "2px solid #FFFFFF": "2px solid #e49e3d"}" " >
                                            <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px;">${(d.data.username != "None") ? parseFloat(d.data.plan_name).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) +" USD": ""}</div>
                                            <div class="" style="background-color: #343a40; margin-top:${-imageDiffVert - 20}px;
                                            margin-left:${15}px;border-radius:100px;width:50px;height:50px;  border: 1px solid ${!d.data.is_master_code ? "#FFFFFF": "#e49e3d"}" ></div>
                                            <div style="margin-top:${-imageDiffVert - 20}px; ">   <img src="${(d.data.username != "None")
                                             ? d.data.imageUrl : ""}" 
                                            style="margin-left:${20}px;border-radius:100px;width:40px;height:40px; " /></div>
                                            <div style="font-size:15px;color:#FFFFFF;margin-left:20px;margin-top:10px">  ${d.data.name || t("No first name")} </div>
                                             <div style="font-size:12px;margin-left:20px;">  ${d.data.username || t("No first name")} </div>
                
                                        </div>
                                    </div>
                                            `;
                    })
                    .container(d3Container.current)
                    .data(JSON.parse(JSON.stringify(data)))
                    .compact(false)
                    .render();
    
                setChartRendered(true)
            }, 1000)
            
        }
    }, [data]);

    return (
        <div className="relative w-100" id="container-chart" >
            {
                (!chartRendered) && (
                    <Loading />
                )
            }
            <div ref={d3Container} style={{width: width}}  />


        </div>
    );
};