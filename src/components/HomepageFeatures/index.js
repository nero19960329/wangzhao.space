import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "关于我",
    description: (
      <>
        <p>我是一位现居东京的软件工程师。</p>
        <p>
          <h4>教育背景</h4>
          <li>
            2013.08~2017.07{" "}
            <a href="https://www.tsinghua.edu.cn/en/">清华大学</a>软件工程，本科
          </li>
          <li>
            2017.08~2020.07{" "}
            <a href="https://www.tsinghua.edu.cn/en/">清华大学</a>软件工程，硕士
          </li>
        </p>
        <p>
          <h4>工作经历</h4>
          <li>
            2019.07~2019.09 <a href="https://www.hulu.com">Hulu LLC</a>
            ，实习软件开发工程师，中国北京
          </li>
          <li>
            2020.07~2023.07 <a href="https://en.megvii.com/">旷视科技</a>
            ，软件开发工程师，中国北京
          </li>
          <li>
            2023.10~至今{" "}
            <a href="https://web.archive.org/web/20240416195045/https://www.jp.tusimple.com/">
              图森未来
            </a>
            ，软件开发工程师，日本东京
          </li>
        </p>
        <p>
          欢迎关注<a href="https://github.com/nero19960329">我的 GitHub</a>。
        </p>
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p className="text--left">{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
