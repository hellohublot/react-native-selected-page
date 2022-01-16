package com.hublot.selectedlabel;

import android.graphics.Typeface;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

import static com.facebook.react.views.text.ReactBaseTextShadowNode.UNSET;

public class HTSelectedLabelViewManager extends SimpleViewManager<HTSelectedLabel> {

    @NonNull
    @Override
    public String getName() {
        return "HTSelectedLabel";
    }

    @NonNull
    @Override
    protected HTSelectedLabel createViewInstance(@NonNull ThemedReactContext reactContext) {
        HTSelectedLabel selectedLabel = new HTSelectedLabel(reactContext);
        return selectedLabel;
    }

    @ReactProp(name = "normalColor")
    public void setNormalColor(HTSelectedLabel view, int normalColor) {
        view.normalColor = normalColor;
    }

    @ReactProp(name = "selectedColor")
    public void setSelectedColor(HTSelectedLabel view, int selectedColor) {
        view.selectedColor = selectedColor;
    }

    @ReactProp(name = "selectedScale")
    public void setSelectedScale(HTSelectedLabel view, float selectedScale) {
        view.selectedScale = selectedScale;
    }

    @ReactProp(name = "text")
    public void setText(HTSelectedLabel view, String text) {
        view.setText(text);
    }





    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = Float.NaN)
    public void setFontSize(HTSelectedLabel view, float fontSize) {
        view.fontSize = fontSize;
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    public void setFontFamily(HTSelectedLabel view, @Nullable String fontFamily) {
        view.fontFamily = fontFamily;
    }

    private int parseNumericFontWeight(String fontWeightString) {
        return fontWeightString.length() == 3
            && fontWeightString.endsWith("00")
            && fontWeightString.charAt(0) <= '9'
            && fontWeightString.charAt(0) >= '1'
            ? 100 * (fontWeightString.charAt(0) - '0')
            : UNSET;
    }

    @ReactProp(name = ViewProps.FONT_WEIGHT)
    public void setFontWeight(HTSelectedLabel view, @Nullable String fontWeightString) {
        int fontWeightNumeric =
            fontWeightString != null ? parseNumericFontWeight(fontWeightString) : UNSET;
        int fontWeight = fontWeightNumeric != UNSET ? fontWeightNumeric : Typeface.NORMAL;

        if (fontWeight == 700 || "bold".equals(fontWeightString)) fontWeight = Typeface.BOLD;
        else if (fontWeight == 400 || "normal".equals(fontWeightString)) fontWeight = Typeface.NORMAL;

        view.fontWeight = fontWeight;
    }

    @ReactProp(name = ViewProps.FONT_STYLE)
    public void setFontStyle(HTSelectedLabel view, @Nullable String fontStyleString) {
        int fontStyle = UNSET;
        if ("italic".equals(fontStyleString)) {
            fontStyle = Typeface.ITALIC;
        } else if ("normal".equals(fontStyleString)) {
            fontStyle = Typeface.NORMAL;
        }
        view.fontStyle = fontStyle;
    }

    @Override
    public void updateProperties(@NonNull HTSelectedLabel viewToUpdate, ReactStylesDiffMap props) {
        super.updateProperties(viewToUpdate, props);
        viewToUpdate.reloadContentSize();
    }
}
