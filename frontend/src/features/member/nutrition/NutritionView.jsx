import { useState } from "react";
import { Check, Plus, Minus, Trash2, Droplets, Flame } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { IconButton } from "../../../shared/ui/IconButton.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Field } from "../../../shared/ui/Field.jsx";
import { Select } from "../../../shared/ui/Select.jsx";
import { Empty } from "../../../shared/ui/Empty.jsx";
import { formatNumber } from "../../../shared/lib/format.js";
import React from "react";

export function NutritionView({ ctx }) {
  const [add, setAdd] = useState(false),
    [meal, setMeal] = useState({
      name: "",
      meal: "Bữa tối",
      calories: 400,
    });
  const { sample, setSample } = ctx,
    total = sample.meals.reduce((s, m) => s + Number(m.calories), 0);
  return (
    <>
      <PageTitle
        title="Nhật ký dinh dưỡng"
        description="Ghi bữa ăn và nước uống trong ngày."
        action={
          <Button icon={Plus} onClick={() => setAdd(true)}>
            Thêm bữa ăn
          </Button>
        }
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Nhật ký này chưa kết nối backend.</span>
      </div>
      <div className="g-nutrition-summary">
        <div>
          <Flame size={24} />
          <span>Năng lượng hôm nay</span>
          <strong>
            {formatNumber(total)}
            <small> / 1.800 kcal</small>
          </strong>
          <p>{sample.meals.length} bữa đã ghi.</p>
        </div>
        <div>
          <Droplets size={24} />
          <span>Nước uống</span>
          <strong>
            {formatNumber(sample.water / 1000)}
            <small> / 2,5 lít</small>
          </strong>
          <div className="g-water-controls">
            <Button
              quiet
              icon={Minus}
              aria-label="Bớt 250 ml nước"
              disabled={sample.water <= 0}
              onClick={() =>
                setSample((s) => ({
                  ...s,
                  water: Math.max(0, s.water - 250),
                }))
              }
            >
              250 ml
            </Button>
            <Button
              icon={Plus}
              aria-label="Thêm 250 ml nước"
              onClick={() =>
                setSample((s) => ({
                  ...s,
                  water: s.water + 250,
                }))
              }
            >
              250 ml
            </Button>
          </div>
        </div>
      </div>
      <Section title="Bữa ăn đã ghi">
        <div className="g-meal-journal">
          {sample.meals.map((m, i) => (
            <article key={m.id}>
              <span className="g-meal-symbol">
                <Flame size={22} />
              </span>
              <div>
                <span>{m.meal}</span>
                <h3>{m.name}</h3>
              </div>
              <strong>
                {formatNumber(m.calories)}
                <small> kcal</small>
              </strong>
              <IconButton
                icon={Trash2}
                label={"Xóa bữa " + m.name}
                onClick={() =>
                  setSample((s) => ({
                    ...s,
                    meals: s.meals.filter((x) => x.id !== m.id),
                  }))
                }
              />
            </article>
          ))}
        </div>
        {!sample.meals.length && <Empty title="Chưa ghi bữa ăn nào" />}
      </Section>
      {add && (
        <Modal
          title="Ghi bữa ăn mẫu"
          description="Ghi lại món ăn và lượng calo ước tính."
          onClose={() => setAdd(false)}
        >
          <form
            className="g-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSample((s) => ({
                ...s,
                meals: [
                  ...s.meals,
                  {
                    ...meal,
                    id: Date.now(),
                    calories: Number(meal.calories),
                  },
                ],
              }));
              setAdd(false);
              ctx.flash("Đã thêm bữa ăn vào nhật ký mẫu.");
            }}
          >
            <Select
              label="Bữa ăn"
              value={meal.meal}
              onChange={(e) =>
                setMeal((m) => ({
                  ...m,
                  meal: e.target.value,
                }))
              }
            >
              {["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
            <Field
              label="Món ăn"
              required
              value={meal.name}
              onChange={(e) =>
                setMeal((m) => ({
                  ...m,
                  name: e.target.value,
                }))
              }
            />
            <Field
              label="Calo ước tính"
              type="number"
              min={1}
              max={5000}
              required
              value={meal.calories}
              onChange={(e) =>
                setMeal((m) => ({
                  ...m,
                  calories: e.target.value,
                }))
              }
            />
            <Button type="submit" icon={Check}>
              Ghi bữa ăn
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
