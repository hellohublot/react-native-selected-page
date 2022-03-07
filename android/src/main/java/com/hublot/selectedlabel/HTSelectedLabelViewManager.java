package com.hublot.selectedlabel;

import android.graphics.Typeface;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTypefaceUtils;

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
        view.setTextSize(fontSize);
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    public void setFontFamily(HTSelectedLabel view, @Nullable String fontFamily) {
        view.fontFamily = fontFamily;
    }

    @ReactProp(name = ViewProps.FONT_WEIGHT)
    public void setFontWeight(HTSelectedLabel view, @Nullable String fontWeightString) {
        view.fontWeight = ReactTypefaceUtils.parseFontWeight(fontWeightString);
    }

    @ReactProp(name = ViewProps.FONT_STYLE)
    public void setFontStyle(HTSelectedLabel view, @Nullable String fontStyleString) {
        view.fontStyle = ReactTypefaceUtils.parseFontStyle(fontStyleString);
    }

    @Override
    public void updateProperties(@NonNull HTSelectedLabel viewToUpdate, ReactStylesDiffMap props) {
        super.updateProperties(viewToUpdate, props);
        viewToUpdate.reloadContentSize();
    }
}
