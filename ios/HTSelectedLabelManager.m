//
//  HTSelectedLabelManager.m
//  react-native-selectedlabel
//
//  Created by hublot on 2020/11/2.
//

#import "HTSelectedLabelManager.h"
#import "HTSelectedLabel.h"
#import <React/RCTUIManager.h>
#import <React/RCTFont.h>
#import <React/RCTConvert+Transform.h>
#import <React/RCTImageShadowView.h>

@interface HTSelectedLabelManager ()

@end

@implementation HTSelectedLabelManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(normalColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(selectedColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(text, NSString)

RCT_EXPORT_VIEW_PROPERTY(selectedScale, CGFloat)

RCT_CUSTOM_VIEW_PROPERTY(fontSize, NSNumber, HTSelectedLabel) {
    view.font = [RCTFont updateFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, HTSelectedLabel) {
    view.font = [RCTFont updateFont:view.font withWeight:json];
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, HTSelectedLabel) {
    view.font = [RCTFont updateFont:view.font withStyle:json];
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, HTSelectedLabel) {
    view.font = [RCTFont updateFont:view.font withFamily:json ?: defaultView.font.familyName];
}

RCT_CUSTOM_VIEW_PROPERTY(transform, CATransform3D, HTSelectedLabel) {
    [view reloadTransform3D:json ? [RCTConvert CATransform3D:json] : defaultView.layer.transform];
}

- (HTSelectedLabel *)view {
    HTSelectedLabel *selectedLabel = [[HTSelectedLabel alloc] initWithFrame:CGRectZero];
    selectedLabel.bridge = self.bridge;
    return selectedLabel;
}

@end
